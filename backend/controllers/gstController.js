const axios = require('axios');
const crypto = require('crypto');

// In-memory store for session cookies
const gstSessions = {};

exports.getCaptcha = async (req, res) => {
    try {
        const id = crypto.randomUUID();
        
        // 1. Initialize session and get cookies
        const initResponse = await axios.get("https://services.gst.gov.in/services/searchtp", {
            validateStatus: () => true
        });
        
        let cookiesMap = new Map();
        
        const extractCookies = (res) => {
            const setCookies = res.headers['set-cookie'];
            if (setCookies) {
                setCookies.forEach(c => {
                    const pair = c.split(';')[0];
                    const [key] = pair.split('=');
                    cookiesMap.set(key, pair);
                });
            }
        };

        extractCookies(initResponse);

        // 2. Fetch Captcha using the cookies
        const captchaResponse = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: {
                'Cookie': Array.from(cookiesMap.values()).join('; ')
            },
            responseType: 'arraybuffer'
        });
        
        extractCookies(captchaResponse);

        const captchaBase64 = Buffer.from(captchaResponse.data, 'binary').toString('base64');

        // 3. Store ALL accumulated cookies against the session ID
        gstSessions[id] = { cookies: Array.from(cookiesMap.values()).join('; ') };

        // Auto-cleanup session after 5 minutes
        setTimeout(() => {
            delete gstSessions[id];
        }, 5 * 60 * 1000);

        res.json({
            sessionId: id,
            image: "data:image/png;base64," + captchaBase64
        });
    } catch (error) {
        console.error('Error in fetching captcha:', error);
        res.status(500).json({ error: "Error in fetching captcha" });
    }
};

exports.getGSTDetails = async (req, res) => {
    try {
        const { sessionId, GSTIN, captcha } = req.body;

        if (!sessionId || !GSTIN || !captcha) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const session = gstSessions[sessionId];
        if (!session) {
            return res.status(400).json({ error: "Invalid or expired session id" });
        }

        const gstData = {
            gstin: GSTIN,
            captcha: captcha
        };

        const response = await axios.post("https://services.gst.gov.in/services/api/search/taxpayerDetails", gstData, {
            headers: {
                'Cookie': session.cookies
            }
        });

        // The GST portal returns a status code 200 even for invalid captchas but with an error message in body.
        const gstDataResponse = response.data;

        if (!gstDataResponse.error && !gstDataResponse.errorCode && gstDataResponse.sts) {
            try {
                const db = require('../config/db');
                await db.execute(
                    'INSERT INTO GstCache (gstin, raw_data, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE raw_data=?, status=?',
                    [GSTIN, JSON.stringify(gstDataResponse), gstDataResponse.sts, JSON.stringify(gstDataResponse), gstDataResponse.sts]
                );
            } catch (dbErr) {
                console.error("Failed to save to GstCache", dbErr);
            }
        }

        res.json(gstDataResponse);
    } catch (error) {
        console.error('Error in fetching GST Details:', error);
        res.status(500).json({ error: "Error in fetching GST Details" });
    }
};

exports.getCachedGST = async (req, res) => {
    try {
        const db = require('../config/db');
        const [rows] = await db.execute('SELECT raw_data FROM GstCache WHERE gstin = ?', [req.params.gstin.toUpperCase()]);
        if (rows.length > 0) {
            return res.json(rows[0].raw_data);
        }
        res.status(404).json({ error: "GSTIN not found in cache" });
    } catch (error) {
        console.error('Error fetching cached GST:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.searchHSNCatalog = (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) return res.json([]);
        
        const fs = require('fs');
        const path = require('path');
        const catalogPath = path.join(__dirname, '..', 'data', 'hsn_catalog.json');
        
        if (!fs.existsSync(catalogPath)) {
            return res.json([]);
        }
        
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        const lowerQuery = query.toLowerCase();
        
        // Exact match on code
        const exact = catalog.filter(item => item.code === lowerQuery);
        // Starts with code (excluding exact)
        const startsWith = catalog.filter(item => item.code.startsWith(lowerQuery) && item.code !== lowerQuery);
        // Matches description (excluding above)
        const descMatch = catalog.filter(item => !item.code.startsWith(lowerQuery) && item.description && item.description.toLowerCase().includes(lowerQuery));
        
        const results = [...exact, ...startsWith, ...descMatch].slice(0, 20);
        
        res.json(results);
    } catch (error) {
        console.error('Error searching HSN catalog:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};
