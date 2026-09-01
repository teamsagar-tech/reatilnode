import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | RetailNode</title>
      </Helmet>
      
      <div className="flex flex-col h-screen font-sans text-[14px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        {/* Header */}
        <div className="bg-[#1b5e58] text-white font-bold px-4 py-2 border-b-2 border-[#12423d] flex justify-between items-center shadow-sm">
          <span>Privacy Policy</span>
          <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 underline text-xs">
            [ESC] Back
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 p-2 gap-2 overflow-hidden h-full">
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] overflow-y-auto shadow-inner p-8">
            <h1 className="text-2xl font-bold text-[#12423d] mb-2 border-b border-[#a3c3be] pb-2">Privacy Policy</h1>
            <p className="text-xs font-bold text-slate-500 mb-6">Last Updated: August 26, 2026</p>

            <div className="text-slate-800 space-y-4 font-medium text-[13px]">
              <p>
                At RetailNode, we take your privacy and data security seriously. This Privacy Policy details how we collect, use, and protect your information when you use our SaaS platform.
              </p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">1. Data Collection & Usage</h2>
              <p>We collect information to provide better services to all our users. The data we collect includes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account Information:</strong> Names, email addresses, phone numbers, and authentication credentials.</li>
                <li><strong>Tenant Data:</strong> Sales records, inventory data, supplier information, and other business-critical data uploaded into your firm's specific tenant environment.</li>
                <li><strong>Usage Data:</strong> Application logs, IP addresses, browser types, and interaction metrics to improve system performance.</li>
              </ul>
              <p>Your data is strictly isolated using our multi-tenant architecture. No other tenant can access your business information.</p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">2. Data Security & Storage</h2>
              <p>We implement enterprise-grade security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS. Passwords are securely hashed.</li>
                <li><strong>Access Control:</strong> We enforce strict Role-Based Access Control (RBAC). Only authorized personnel within your organization can access sensitive modules.</li>
                <li><strong>Database Isolation:</strong> Tenant isolation is programmatically enforced on every database query, ensuring data boundaries are never breached.</li>
              </ul>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">3. Data Sharing</h2>
              <p>We do not sell, trade, or rent your personal or business information to third parties. We may share generic aggregated demographic information not linked to any personal identification information.</p>
              
              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">4. Your Rights</h2>
              <p>You have the right to request access to the data we hold about you, request corrections, or request deletion of your account and associated data. Since data belongs to the Firm (Tenant), such requests must be authorized by your Firm's super administrator.</p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with RetailNode, please contact us at:</p>
              
              <div className="bg-[#eef5ed] border border-[#a3c3be] p-4 mt-2">
                <p className="font-bold text-[#12423d]">RetailNode Security Team</p>
                <p className="font-bold mt-1">Email: <a href="mailto:sagarmohite2808@gmail.com" className="text-blue-700 hover:underline">sagarmohite2808@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">Privacy Policy</div>
          <div className="flex gap-6">
            <span>© {new Date().getFullYear()} RetailNode. All rights reserved.</span>
          </div>
        </div>
      </div>
    </>
  );
}
