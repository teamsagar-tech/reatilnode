import React from "react"
import { Helmet } from "react-helmet-async"
import { FileText, CheckCircle, AlertTriangle, Scale, CreditCard, XCircle, Settings } from "lucide-react"

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Terms of Service & Licensing | RetailNode</title>
        <meta name="description" content="Review the terms of service, software licensing agreements, and SLA policies for RetailNode's Enterprise ERP platform." />
      </Helmet>
      
      <section className="bg-slate-900 py-12 md:py-24 text-center border-b border-slate-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <FileText className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Service</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Please read these terms carefully before using the RetailNode Cloud ERP platform.
            <br/><span className="text-sm mt-4 inline-block text-slate-500">Effective Date: August 18, 2026</span>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 prose prose-lg prose-slate max-w-none">
            
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("Client", "You"), and RetailNode Technologies Pvt. Ltd. ("RetailNode", "We", "Us"), concerning your access to and use of the RetailNode Enterprise ERP Software-as-a-Service (SaaS) platform, APIs, and mobile applications (collectively, the "Service").
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary" /> 1. Software Licensing & Usage Rights
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Subject to your continuous compliance with these Terms and timely payment of subscription fees, RetailNode grants you a revocable, non-exclusive, non-transferable, limited license to access and use the Service strictly for your internal business operations.
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Restrictions:</strong> You shall not: (a) reverse-engineer, decompile, disassemble, or attempt to derive the source code of the Service; (b) rent, lease, sublicense, distribute, or time-share the Service; (c) use the Service to build a competitive product; or (d) perform automated penetration testing without prior written consent.</li>
              <li><strong>Authorized Users:</strong> You are responsible for all activities occurring under your administrative and cashier accounts. You must promptly notify us of any unauthorized use of your credentials.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" /> 2. Subscription, Billing, & Fair Use
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              The Service is provided on a subscription basis (Monthly, Quarterly, or Annually) tied to the number of active physical branches/stores, POS terminals, and data consumption tiers.
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Payments:</strong> All fees are exclusive of applicable taxes (e.g., GST), which will be added to your invoice. Payments are non-refundable except where legally mandated.</li>
              <li><strong>API Fair Use:</strong> Base subscriptions include a generous limit of API requests for third-party integrations (like Shopify and WhatsApp). Extraordinary programmatic abuse resulting in server strain will result in rate-limiting or mandatory upgrades to an Enterprise Tier.</li>
              <li><strong>Non-Payment:</strong> Failure to pay renewal invoices within the 7-day grace period will result in an automated transition of your account to "Read-Only" mode. Full suspension occurs after 14 days of non-payment.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" /> 3. Service Level Agreement (SLA) & Maintenance
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We understand that downtime directly equates to lost revenue in retail. RetailNode offers a financially backed 99.9% Uptime SLA for our Enterprise Plan customers.
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Scheduled Maintenance:</strong> We strictly perform systemic updates between 2:00 AM and 5:00 AM IST. Administrators will be notified at least 48 hours prior to any maintenance requiring downtime.</li>
              <li><strong>Unplanned Outages:</strong> In the rare event of a server disruption, our engineering team adheres to a 30-minute initial response protocol.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" /> 4. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed font-bold">
              The Service is provided on an "AS-IS" and "AS-AVAILABLE" basis without warranties of any kind, either express or implied, including, but not limited to, warranties of merchantability or fitness for a particular purpose.
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Tax & Compliance Disclaimer:</strong> RetailNode provides tools to automate GST calculations and generate E-Way Bills. However, the ultimate responsibility for tax compliance, accurate invoice generation, and timely government filings rests entirely with you and your appointed Chartered Accountant or financial advisor.</li>
              <li><strong>Third-Party Outages:</strong> We are not liable for business interruptions caused by external factors out of our control, including downtime of the NIC GST Portal, Meta WhatsApp API outages, Bank Gateway failures, or local internet Service Provider drops.</li>
              <li><strong>Liability Cap:</strong> In no event shall RetailNode's aggregate liability for direct damages exceed the total amount paid by you for the Service during the six (6) months immediately preceding the incident giving rise to the claim.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-primary" /> 5. Termination & Off-boarding
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              You may initiate a cancellation request via your account manager or the billing dashboard. 
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li>Upon cancellation, your account will remain active until the end of the current prepaid billing cycle. No pro-rated refunds are provided.</li>
              <li>You are solely responsible for exporting all required financial ledgers, inventory reports, and customer data using the built-in export modules prior to the final account closure date.</li>
              <li>As outlined in our Privacy Policy, data will be permanently wiped 30 days post-termination.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              <Scale className="w-6 h-6 text-primary" /> 6. Indemnification & Governing Law
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              You agree to indemnify, defend, and hold harmless RetailNode and its officers, directors, and employees from any claims, damages, or legal expenses arising from your violation of these Terms, unauthorized data uploading, or fraudulent business practices.
            </p>

            <div className="bg-slate-100 p-6 rounded-lg mt-12 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legal Jurisdiction</h3>
              <p className="text-slate-600 text-sm m-0 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal suits, actions, or proceedings arising out of this agreement shall be instituted exclusively in the federal or state courts located in <strong>Mumbai, Maharashtra, India</strong>.
              </p>
            </div>
            
            <div className="mt-8 text-sm text-slate-500">
              For legal inquiries or clarifications regarding these Terms, please contact our legal department at <a href="mailto:legal@retailnode.in" className="text-primary hover:underline">legal@retailnode.in</a>.
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsOfService
