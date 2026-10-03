require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes'); // Mock routes, kept for reference
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const sizeGroupRoutes = require('./routes/sizeGroupRoutes');
const customerRoutes = require('./routes/customerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const itemRoutes = require('./routes/itemRoutes');
const genericMasterRoutes = require('./routes/genericMasterRoutes');
const partyRoutes = require('./routes/partyRoutes');
const firmRoutes = require('./routes/firmRoutes');
const locationRoutes = require('./routes/locationRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const purchaseInvoiceRoutes = require('./routes/purchaseInvoiceRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const gstRoutes = require('./routes/gstRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const labelPrintRoutes = require('./routes/labelPrintRoutes');
const salesRoutes = require('./routes/salesRoutes');
const manageReceivableRoutes = require('./routes/manageReceivableRoutes');
const returnsRoutes = require('./routes/returnsRoutes');
const cutRoutes = require('./routes/cutRoutes');

const app = express();

// Initialize Daily Cron Jobs
require('./cron/dailyReport').initCronJobs();

const db = require('./config/db');
(async () => {
  try {
    await db.execute('ALTER TABLE Parties ADD COLUMN categories JSON');
    console.log('Added categories column to Parties');
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
  }
  try {
    await db.execute('ALTER TABLE Parties ADD COLUMN brands JSON');
    console.log('Added brands column to Parties');
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
  }
  try {
    await db.execute('ALTER TABLE Locations ADD COLUMN settings JSON');
    console.log('Added settings column to Locations');
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
  }
  
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS UserFirms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        firm_id INT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        role_id INT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY idx_user_firm (user_id, firm_id),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (firm_id) REFERENCES Firms(id) ON DELETE CASCADE
      )
    `);
    console.log('UserFirms table checked/created');

    // Initial migration: copy existing firm_id mappings from Users to UserFirms
    const [existing] = await db.execute('SELECT COUNT(*) as cnt FROM UserFirms');
    if (existing[0].cnt === 0) {
      await db.execute(`
        INSERT IGNORE INTO UserFirms (user_id, firm_id, role, role_id)
        SELECT id, firm_id, role, role_id FROM Users WHERE firm_id IS NOT NULL
      `);
      console.log('Migrated existing users to UserFirms');
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
})();

// Global Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://app.retailnode.in',
  'https://app2.retailnode.in',
  'https://retailnode.in',
  'https://www.retailnode.in',
  'https://onevastra.technfest.com',
  'https://ovapi.technfest.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());

// Audit Logging (Tracks all API calls globally)
const { auditMiddleware } = require('./middleware/auditMiddleware');
app.use(auditMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/firms', firmRoutes);
app.use('/api/masters/cut', cutRoutes);
app.use('/api/masters/brand', brandRoutes);
app.use('/api/masters/size-groups', sizeGroupRoutes);
app.use('/api/masters/category', categoryRoutes);
app.use('/api/masters/location', locationRoutes);
app.use('/api/masters/generic', genericMasterRoutes);
app.use('/api/masters/item', itemRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/masters/party', partyRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/user-series', require('./routes/userSeriesRoutes'));
app.use('/api/tickets', ticketRoutes);
app.use('/api/purchase-invoices', purchaseInvoiceRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/gst', gstRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/label-print', labelPrintRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/manage-receivable', manageReceivableRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RetailNode SaaS Backend is running' });
});

// Basic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
