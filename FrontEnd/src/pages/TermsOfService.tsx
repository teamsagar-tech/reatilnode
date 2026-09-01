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
                <p className="text-slate-500 font-medium mt-1">Last Updated: August 26, 2026</p>
              </div>
            </div>

            <div className="prose prose-slate prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-semibold">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Please read these Terms of Service completely before using RetailNode. This document acts as a legally binding contract establishing the terms under which you may use our ERP platform.
              </p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-emerald-500" />
                1. Acceptance of Terms
              </h2>
              <p>By registering for and using RetailNode, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.</p>

              <h2 className="text-2xl mt-8 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-emerald-500" />
                2. SaaS Multi-Tenancy & Data Ownership
              </h2>
              <p>RetailNode is a cloud-based Software as a Service (SaaS). </p>
              <ul>
                <li><strong>Data Ownership:</strong> You retain all rights and ownership to the business data you input into RetailNode. We claim no intellectual property rights over the material you provide to the service.</li>
                <li><strong>Tenant Isolation:</strong> Our systems are designed to strictly isolate your data from other clients (Firms). However, you are responsible for maintaining the confidentiality of your login credentials.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">3. Acceptable Use</h2>
              <p>You agree not to use the platform in a way that:</p>
              <ul>
                <li>Violates any local, state, national, or international laws.</li>
                <li>Attempts to bypass or break any security mechanism, tenant isolation, or rate limiting applied to the service.</li>
                <li>Involves reverse engineering or attempting to extract the source code of the software.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">4. Service Availability & Support</h2>
              <p>While we strive for 99.9% uptime, we do not guarantee that the service will be completely uninterrupted. Scheduled maintenance will be communicated in advance. Support is provided as per your Service Level Agreement (SLA).</p>

              <h2 className="text-2xl mt-8 mb-4">5. Termination</h2>
              <p>We reserve the right to suspend or terminate your access to the service immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will immediately cease.</p>

              <h2 className="text-2xl mt-8 mb-4">6. Contact Information</h2>
              <p>If you have any questions or concerns regarding these terms, please contact our legal and support team at:</p>
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
