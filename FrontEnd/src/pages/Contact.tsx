import { useState } from "react"
import type { FormEvent } from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import { Helmet } from "react-helmet-async"

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      formType: 'Demo',
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      location: formData.get('location'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        e.currentTarget.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Contact Sales & Support | RetailNode</title>
        <meta name="description" content="Get in touch with RetailNode's ERP migration experts to schedule a free demo or discuss custom integration requirements." />
      </Helmet>
      <section className="bg-slate-900 text-white py-12 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Book an Enterprise Consultation</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Speak directly with our senior solutions architects to understand how RetailNode can seamlessly replace your legacy ERP, secure your data, and scale with your growth.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xl border-t-4 border-t-primary">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Architecture Consultation Request</h2>
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Consultation Requested!</h3>
                <p className="text-slate-600 text-lg">Our senior solutions architect will contact you shortly.</p>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company / Firm Name</label>
                  <input type="text" name="company" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Your Textile Co." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Annual Turnover Bracket</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                  <option value="">Select turnover bracket</option>
                  <option value="under-5cr">Under ₹5 Cr</option>
                  <option value="5cr-50cr">₹5 Cr - ₹50 Cr</option>
                  <option value="50cr-200cr">₹50 Cr - ₹200 Cr</option>
                  <option value="200cr-plus">₹200+ Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input type="text" name="location" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="City, State" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current ERP / Accounting System</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="e.g., Custom ERP, Legacy Software, Spreadsheets" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Specific Migration or Scale Concerns?</label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="I'm concerned about mapping our custom godown structures..."></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover shadow-lg hover:-translate-y-1 transition-all uppercase tracking-wider mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                {loading ? 'Sending Request...' : 'Request Private Consultation'}
              </button>
              <p className="text-center text-xs text-slate-500 font-medium mt-4">Your information is secured with military-grade encryption.</p>
            </form>
            )}
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Get in touch directly</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our sales and support teams are ready to answer your technical questions or guide you through a custom onboarding.
              </p>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Call Sales</h3>
                <p className="text-lg text-slate-700 font-medium">+91 8857808284</p>
                <p className="text-sm text-slate-500 mt-1">Mon-Sat, 9:00 AM - 7:00 PM (IST)</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Email Us</h3>
                <p className="text-lg text-slate-700 font-medium">sagarmohite2808@gmail.com</p>
                <p className="text-sm text-slate-500 mt-1">We reply within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Headquarters</h3>
                <p className="text-lg text-slate-700">RetailNode Systems Pvt. Ltd.</p>
                <p className="text-lg text-slate-700">Innovation Park, Textile Hub</p>
                <p className="text-lg text-slate-700">Surat, Gujarat, India</p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}

export default Contact
