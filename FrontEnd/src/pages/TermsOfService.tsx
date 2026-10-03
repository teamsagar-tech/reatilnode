import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service | RetailNode</title>
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
              <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
                <p className="text-slate-500 font-medium mt-1">Last Updated: October 2, 2026</p>
              </div>
            </div>

            <div className="prose prose-slate prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-semibold">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the RetailNode ERP platform operated by our company. This document forms a legally binding contract establishing the conditions under which you may access and utilize our services.
              </p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-emerald-500" />
                1. Acceptance & Scope of Terms
              </h2>
              <p>By registering for an account, accessing, or utilizing RetailNode, you explicitly agree to be bound by these Terms of Service and all applicable laws. If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms. If you do not agree with any part of these terms, you must cease use of the platform immediately.</p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-emerald-500" />
                2. SaaS Multi-Tenancy, Data Ownership, & Licensing
              </h2>
              <p>RetailNode is provided as a Software as a Service (SaaS). We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the platform strictly in accordance with these Terms.</p>
              <ul>
                <li><strong>Data Ownership:</strong> You retain complete ownership and intellectual property rights to all business data, customer records, and inventory metrics you input into RetailNode. We claim no ownership over the material you provide.</li>
                <li><strong>Tenant Isolation & Security:</strong> Our architecture guarantees strict multi-tenant isolation. However, you are solely responsible for safeguarding your login credentials and ensuring that Role-Based Access Control (RBAC) within your firm is configured appropriately.</li>
                <li><strong>Data Backup:</strong> While we perform regular automated backups for disaster recovery purposes, you are advised to maintain your own records. We are not liable for accidental data loss caused by user error.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">3. Acceptable Use Policy</h2>
              <p>You agree to use the platform solely for lawful business purposes. You explicitly agree <strong>not</strong> to:</p>
              <ul>
                <li>Use the service in any way that violates any applicable local, national, or international laws or regulations.</li>
                <li>Attempt to probe, scan, or test the vulnerability of the system, or bypass any security mechanism, rate limiting, or tenant isolation protocol.</li>
                <li>Reverse engineer, decompile, or attempt to extract the source code of the RetailNode software.</li>
                <li>Use the platform to distribute malware, spam, or engage in any activity that disrupts the performance of the servers for other tenants.</li>
                <li>Resell, sublicense, or share your account access with unauthorized third parties.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">4. Subscription, Billing, & Payments</h2>
              <p>RetailNode is a subscription-based service. By subscribing, you agree to pay all applicable fees associated with your chosen plan.</p>
              <ul>
                <li><strong>Payment Terms:</strong> Subscription fees are billed in advance on a recurring cycle (monthly or annually). All fees are non-refundable unless otherwise required by law.</li>
                <li><strong>Upgrades & Downgrades:</strong> You may upgrade your plan at any time; prorated charges will apply. Downgrades will take effect at the start of the next billing cycle.</li>
                <li><strong>Taxes:</strong> You are responsible for all applicable taxes, levies, or duties imposed by taxing authorities associated with your purchases.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">5. Service Availability (SLA) & Maintenance</h2>
              <p>We strive to maintain a 99.9% uptime for the RetailNode platform. However, the service is provided on an "AS IS" and "AS AVAILABLE" basis. We reserve the right to perform scheduled maintenance, during which the service may be temporarily unavailable. We will endeavor to provide advance notice for significant maintenance windows.</p>

              <h2 className="text-2xl mt-8 mb-4">6. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, RetailNode, its directors, employees, partners, and suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service.</li>
                <li>Any conduct or content of any third party on the Service.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">7. Termination</h2>
              <p>We reserve the right to suspend or terminate your account and access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of these Terms. Upon termination, your right to use the Service will immediately cease. You may terminate your account at any time by contacting support or using the billing dashboard.</p>

              <h2 className="text-2xl mt-8 mb-4">8. Modifications to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

              <h2 className="text-2xl mt-8 mb-4">9. Contact Information</h2>
              <p>If you have any questions or require legal clarification regarding these terms, please contact our legal and support team at:</p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
                <p className="font-bold text-slate-800 m-0">RetailNode Legal Department</p>
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
