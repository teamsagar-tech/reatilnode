import React from "react"
import { Helmet } from "react-helmet-async"
import { ShieldCheck, Lock, Eye, Database, Server, UserCheck, FileText } from "lucide-react"

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Privacy Policy & Data Security | RetailNode</title>
        <meta name="description" content="Learn how RetailNode secures your enterprise ERP data with bank-grade encryption and strict privacy protocols." />
      </Helmet>
      
      <section className="bg-slate-900 py-12 md:py-24 text-center border-b border-slate-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Privacy Policy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Data Security</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Your ledger, inventory, and customer data are secured with bank-level encryption. We never sell or share your business data.
            <br/><span className="text-sm mt-4 inline-block text-slate-500">Last updated: August 18, 2026</span>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 prose prose-lg prose-slate max-w-none">
            
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              At RetailNode, we understand that trust is the foundation of any ERP system. This Privacy Policy explains how we collect, use, process, and protect your information when you use our services. By using RetailNode, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mt-12">
              <Database className="w-6 h-6 text-primary" /> 1. Information We Collect
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We collect several different types of information to provide and improve our Service to you. This includes:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Account & Billing Information:</strong> Name, business name, GSTIN, billing address, phone number, email address, and payment method details.</li>
              <li><strong>Operational & Business Data:</strong> Complete product catalogs, inventory levels across branches, financial ledgers, job work challans, E-Way bills, supplier details, and customer transaction records.</li>
              <li><strong>End-Customer Data:</strong> Phone numbers, names, and purchase histories of your retail customers logged during POS billing.</li>
              <li><strong>Technical Data:</strong> IP addresses, browser types, device identifiers, login timestamps, and application usage logs for security auditing.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" /> 2. How We Use Your Information
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              RetailNode acts as a Data Processor. The data belongs entirely to your business. We use your data strictly to:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li>Deliver core ERP functionalities including multi-branch inventory sync, POS billing, and financial accounting.</li>
              <li>Process and facilitate automated GST and E-Invoicing filing via authorized government portals upon your explicit request.</li>
              <li>Authenticate your administrative staff and cashiers to prevent unauthorized access.</li>
              <li>Send critical system notifications, billing updates, and maintenance alerts.</li>
              <li>Analyze aggregated, anonymized system metrics to improve server performance and software stability.</li>
            </ul>
            <p className="text-slate-600 mb-8 font-bold border-l-4 border-primary pl-4 py-2 bg-blue-50 rounded-r-md">
              We unequivocally DO NOT sell, rent, lease, or trade your supplier lists, customer data, pricing information, or any operational secrets to third parties, competitors, or marketing agencies.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" /> 3. Data Security & Encryption Standards
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We employ military-grade security architectures to ensure your data remains impenetrable.
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Data in Transit:</strong> All data exchanged between your local machines (POS, web browser, mobile app) and our servers is encrypted using industry-standard TLS 1.3 (Transport Layer Security).</li>
              <li><strong>Data at Rest:</strong> All databases, storage volumes, and backups are encrypted at rest using AES-256 block-level encryption hosted on Amazon Web Services (AWS) data centers located within India (ap-south-1).</li>
              <li><strong>Access Control:</strong> We enforce strict Role-Based Access Control (RBAC). Our engineering team cannot view your financial data without explicit, time-bound consent required for technical troubleshooting.</li>
              <li><strong>Automated Backups:</strong> Database snapshots are captured automatically and replicated across isolated geographical zones to prevent data loss against catastrophic hardware failures or ransomware.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <Server className="w-6 h-6 text-primary" /> 4. Third-Party Integrations & Sub-processors
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              To provide a comprehensive ERP experience, RetailNode integrates with approved third-party APIs. When you activate these integrations, limited necessary data is transmitted:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Government Portals:</strong> NIC IRP APIs for E-Invoice and E-Way bill generation.</li>
              <li><strong>Communication APIs:</strong> WhatsApp Cloud API (Meta) and SMS Gateways for transactional alerts to your customers.</li>
              <li><strong>Payment Gateways:</strong> Razorpay, PineLabs, or banks for processing software subscription fees and dynamic QR POS payments.</li>
              <li><strong>E-Commerce Connectors:</strong> Shopify, WooCommerce, or Magento APIs for inventory syncing.</li>
            </ul>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We ensure all our technical sub-processors comply with stringent global data protection regulations (such as GDPR and India's DPDP Act).
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-primary" /> 5. Your Rights & Data Portability
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              You retain absolute control over your business data. As an authorized administrator, you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li>Export all your ledgers, inventory, and customer databases into standard CSV/JSON formats at any time.</li>
              <li>Request a complete SQL dump of your database (subject to verification).</li>
              <li>Correct inaccurate business or billing information.</li>
              <li>Revoke API access to any third-party integration instantly from your dashboard.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" /> 6. Data Retention & Deletion
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              During an active subscription, your data is retained indefinitely to maintain historical ledgers. Upon cancellation or termination of your subscription, your account enters a 30-day grace period. During this time, you can still log in to export your data. After 30 days, we perform a hard, irrecoverable deletion of your entire database and associated backups from our servers to maintain privacy compliance.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12">7. Policy Updates</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We may update our Privacy Policy periodically to reflect changes in legal requirements or our software features. We will notify administrative users via email and in-app notifications at least 15 days before any significant changes take effect.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg mt-12">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contact our Data Protection Officer</h3>
              <p className="text-slate-700 m-0">
                If you have questions about this Privacy Policy, your rights under the DPDP Act, or if you wish to report a security vulnerability, please contact our Data Protection Officer at: <br/><br/>
                <strong>Email:</strong> <a href="mailto:privacy@retailnode.in" className="text-primary font-bold hover:underline">privacy@retailnode.in</a><br/>
                <strong>Address:</strong> RetailNode Technologies Pvt. Ltd., Tech Park, Andheri East, Mumbai, Maharashtra 400093.
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
