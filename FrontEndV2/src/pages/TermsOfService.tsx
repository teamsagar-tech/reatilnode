import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service | RetailNode</title>
      </Helmet>
      
      <div className="flex flex-col h-screen font-sans text-[14px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        {/* Header */}
        <div className="bg-[#1b5e58] text-white font-bold px-4 py-2 border-b-2 border-[#12423d] flex justify-between items-center shadow-sm">
          <span>Terms of Service</span>
          <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 underline text-xs">
            [ESC] Back
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 p-2 gap-2 overflow-hidden h-full">
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] overflow-y-auto shadow-inner p-8">
            <h1 className="text-2xl font-bold text-[#12423d] mb-2 border-b border-[#a3c3be] pb-2">Terms of Service</h1>
            <p className="text-xs font-bold text-slate-500 mb-6">Last Updated: August 26, 2026</p>

            <div className="text-slate-800 space-y-4 font-medium text-[13px]">
              <p>
                Please read these Terms of Service completely before using RetailNode. This document acts as a legally binding contract establishing the terms under which you may use our ERP platform.
              </p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">1. Acceptance of Terms</h2>
              <p>By registering for and using RetailNode, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.</p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">2. SaaS Multi-Tenancy & Data Ownership</h2>
              <p>RetailNode is a cloud-based Software as a Service (SaaS).</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Data Ownership:</strong> You retain all rights and ownership to the business data you input into RetailNode. We claim no intellectual property rights over the material you provide to the service.</li>
                <li><strong>Tenant Isolation:</strong> Our systems are designed to strictly isolate your data from other clients (Firms). However, you are responsible for maintaining the confidentiality of your login credentials.</li>
              </ul>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">3. Acceptable Use</h2>
              <p>You agree not to use the platform in a way that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violates any local, state, national, or international laws.</li>
                <li>Attempts to bypass or break any security mechanism, tenant isolation, or rate limiting applied to the service.</li>
                <li>Involves reverse engineering or attempting to extract the source code of the software.</li>
              </ul>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">4. Service Availability & Support</h2>
              <p>While we strive for 99.9% uptime, we do not guarantee that the service will be completely uninterrupted. Scheduled maintenance will be communicated in advance. Support is provided as per your Service Level Agreement (SLA).</p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">5. Termination</h2>
              <p>We reserve the right to suspend or terminate your access to the service immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will immediately cease.</p>

              <h2 className="text-lg font-bold text-[#1b5e58] mt-6">6. Contact Information</h2>
              <p>If you have any questions or concerns regarding these terms, please contact our legal and support team at:</p>
              
              <div className="bg-[#eef5ed] border border-[#a3c3be] p-4 mt-2">
                <p className="font-bold text-[#12423d]">RetailNode Legal Department</p>
                <p className="font-bold mt-1">Email: <a href="mailto:sagarmohite2808@gmail.com" className="text-blue-700 hover:underline">sagarmohite2808@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">Terms of Service</div>
          <div className="flex gap-6">
            <span>© {new Date().getFullYear()} RetailNode. All rights reserved.</span>
          </div>
        </div>
      </div>
    </>
  );
}
