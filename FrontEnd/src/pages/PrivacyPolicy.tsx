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
                <p className="text-slate-500 font-medium mt-1">Last Updated: October 2, 2026</p>
              </div>
            </div>

            <div className="prose prose-slate prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-semibold">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                At RetailNode, we take your privacy and data security seriously. This Privacy Policy details how we collect, use, and protect your information when you use our SaaS platform. We are committed to maintaining the trust and confidence of our clients by adhering to stringent enterprise data protection standards.
              </p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-emerald-500" />
                1. Information We Collect
              </h2>
              <p>We collect information to provide better services to all our users. The data we collect includes, but is not limited to:</p>
              <ul>
                <li><strong>Account & Profile Information:</strong> Names, email addresses, phone numbers, billing details, and authentication credentials required to provision and secure your account.</li>
                <li><strong>Business & Tenant Data:</strong> Sales records, inventory data, supplier information, customer databases, tax configurations, and other business-critical data uploaded into your firm's specific tenant environment.</li>
                <li><strong>Automated Usage Data:</strong> Application logs, IP addresses, browser types, device identifiers, and interaction metrics to monitor and improve system performance.</li>
                <li><strong>Communication Data:</strong> Records of your interactions with our support team, including emails, chat logs, and ticketing system histories.</li>
              </ul>
              
              <h2 className="text-2xl mt-8 mb-4">2. How We Use Your Data</h2>
              <p>RetailNode acts primarily as a data processor for the business data you upload. We use the collected data for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To operate, maintain, and provide the features and functionality of the RetailNode ERP platform.</li>
                <li><strong>Security & Authentication:</strong> To verify your identity, prevent fraud, and enforce strict Role-Based Access Control (RBAC) across tenant domains.</li>
                <li><strong>Performance Monitoring:</strong> To analyze usage trends, identify bottlenecks, and optimize our infrastructure for high concurrency.</li>
                <li><strong>Billing & Compliance:</strong> To process transactions, generate invoices, and fulfill our legal obligations regarding financial reporting.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-emerald-500" />
                3. Enterprise Security & Data Isolation
              </h2>
              <p>We implement enterprise-grade security measures to protect your data against unauthorized access, alteration, disclosure, or destruction:</p>
              <ul>
                <li><strong>Tenant Isolation:</strong> Our architecture strictly enforces multi-tenancy. Every database query is programmatically bound to a specific `firm_id`, ensuring data boundaries are never breached. No other tenant can access your business information.</li>
                <li><strong>Encryption in Transit & At Rest:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS 1.2 or higher. Passwords and sensitive tokens are securely hashed using bcrypt and stored with robust salting mechanisms.</li>
                <li><strong>Regular Auditing:</strong> We conduct continuous vulnerability scanning and maintain comprehensive audit logs of all critical actions performed within the system.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">4. Data Sharing & Third-Party Processors</h2>
              <p>We do not sell, trade, or rent your personal or business information to third parties. We only share information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share data with trusted third-party vendors (e.g., cloud hosting providers like AWS/DigitalOcean, payment processors) who assist us in operating our platform, subject to strict confidentiality agreements.</li>
                <li><strong>Legal Compliance:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred as part of the business assets, under the condition that the receiving party agrees to uphold this Privacy Policy.</li>
              </ul>
              
              <h2 className="text-2xl mt-8 mb-4">5. Your Data Rights & GDPR Compliance</h2>
              <p>Depending on your jurisdiction, you may have specific rights regarding your personal data:</p>
              <ul>
                <li><strong>Right to Access & Portability:</strong> You can request a copy of the personal data we hold about you in a structured, machine-readable format.</li>
                <li><strong>Right to Rectification:</strong> You may request the correction of inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> You may request the deletion of your account and associated data. Note: Since business data belongs to the Firm (Tenant), deletion requests for firm data must be authorized by your Firm's Super Administrator.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">6. Data Retention</h2>
              <p>We retain your data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law (e.g., for tax, legal, or accounting purposes). Upon account termination, we will securely delete or anonymize your data in accordance with our data retention schedule.</p>

              <h2 className="text-2xl mt-8 mb-4">7. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. For significant changes, we will provide a more prominent notice (including, for certain services, email notification of Privacy Policy changes).</p>

              <h2 className="text-2xl mt-8 mb-4">8. Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data processing practices, please contact our Data Protection Officer at:</p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
                <p className="font-bold text-slate-800 m-0">RetailNode Security & Privacy Team</p>
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
