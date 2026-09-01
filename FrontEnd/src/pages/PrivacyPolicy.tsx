import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Shield, Lock, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | RetailNode</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-600 font-semibold mb-8 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100">
            <div className="flex items-center space-x-4 mb-8 border-b border-slate-100 pb-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
                <p className="text-slate-500 font-medium mt-1">Last Updated: August 26, 2026</p>
              </div>
            </div>

            <div className="prose prose-slate prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-semibold">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                At RetailNode, we take your privacy and data security seriously. This Privacy Policy details how we collect, use, and protect your information when you use our SaaS platform.
              </p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-emerald-500" />
                1. Data Collection & Usage
              </h2>
              <p>We collect information to provide better services to all our users. The data we collect includes:</p>
              <ul>
                <li><strong>Account Information:</strong> Names, email addresses, phone numbers, and authentication credentials.</li>
                <li><strong>Tenant Data:</strong> Sales records, inventory data, supplier information, and other business-critical data uploaded into your firm's specific tenant environment.</li>
                <li><strong>Usage Data:</strong> Application logs, IP addresses, browser types, and interaction metrics to improve system performance.</li>
              </ul>
              <p>Your data is strictly isolated using our multi-tenant architecture. No other tenant can access your business information.</p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-emerald-500" />
                2. Data Security & Storage
              </h2>
              <p>We implement enterprise-grade security measures to protect your data:</p>
              <ul>
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS. Passwords are securely hashed using bcrypt.</li>
                <li><strong>Access Control:</strong> We enforce strict Role-Based Access Control (RBAC). Only authorized personnel within your organization can access sensitive modules.</li>
                <li><strong>Database Isolation:</strong> Tenant isolation is programmatically enforced on every database query, ensuring data boundaries are never breached.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">3. Data Sharing</h2>
              <p>We do not sell, trade, or rent your personal or business information to third parties. We may share generic aggregated demographic information not linked to any personal identification information.</p>
              
              <h2 className="text-2xl mt-8 mb-4">4. Your Rights</h2>
              <p>You have the right to request access to the data we hold about you, request corrections, or request deletion of your account and associated data. Since data belongs to the Firm (Tenant), such requests must be authorized by your Firm's super administrator.</p>

              <h2 className="text-2xl mt-8 mb-4">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with RetailNode, please contact us at:</p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
                <p className="font-bold text-slate-800 m-0">RetailNode Security Team</p>
                <p className="text-emerald-600 font-semibold m-0 mt-1">
                  <a href="mailto:sagarmohite2808@gmail.com" className="no-underline">sagarmohite2808@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 text-sm font-semibold text-slate-400">
            © 2026 RetailNode. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
