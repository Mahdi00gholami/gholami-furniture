import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  // سیستم اعتبارسنجی زنده ورودی‌های فرم مشتری به زبان انگلیسی
  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    const updatedErrors = { ...errors };

    // ۱. شرط اعتبارسنجی نام مشتری (حداقل ۳ کاراکتر)
    if (field === 'name') {
      if (value.trim().length < 3) {
        updatedErrors.name = 'Name must be at least 3 characters long.';
      } else {
        updatedErrors.name = '';
      }
    }

    // ۲. شرط اعتبارسنجی دقیق فرمت ایمیل
    if (field === 'email') {
      const hasAt = value.includes('@');
      const hasDot = value.includes('.');
      if (value.trim() && (!hasAt || !hasDot || value.length < 5)) {
        updatedErrors.email = 'Invalid email address format (e.g. name@domain.com).';
      } else {
        updatedErrors.email = '';
      }
    }

    setErrors(updatedErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.name && !errors.email && formData.name.trim() && formData.email.trim() && formData.message.trim()) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  // بررسی وضعیت نهایی جهت قفل ماندن یا فعال شدن دکمه ارسال پیام
  const isFormInvalid = errors.name || errors.email || !formData.name.trim() || !formData.email.trim() || !formData.message.trim();
  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-12 font-sans text-left bg-white border border-[#ebdcb9] my-8" dir="ltr">
      
      {/* تیتر بالای صفحه با لبه خط پهلو قهوه‌ای سوخته */}
      <div className="mb-10 border-l-4 border-[#3e2723] pl-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Connect With Our Workshop</h2>
        <p className="text-xs text-gray-400 mt-1">Get in touch for bespoke structural furniture modifications or custom corporate contracts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* ستون سمت چپ: دیتابیس کانال‌ها و راه‌های ارتباطی اختصاصی شما */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#3e2723] text-xs uppercase tracking-wider mb-4">Direct Channels</h3>
          
          {/* (باکس ارتباطی واتس‌اپ ) */}
          <a 
            href="https://chat.whatsapp.com/KZRV52EgEzb2xN14vXvPQR?s=sh&p=a&mlu=4&ilr=4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#fbf9f4] border border-[#ebdcb9] hover:border-[#3e2723] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-mono font-bold shadow-sm">WA</div>
              <div>
                <div className="text-xs font-bold text-gray-900">WhatsApp Channel</div>
                <div className="text-[11px] text-gray-400 font-mono">gholami-furniture</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#3e2723] group-hover:underline">Chat &rarr;</span>
          </a>

          {/* باکس ارتباطی تلگرام ) */}
          <a 
            href="https://t.me/Furniture122333" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#fbf9f4] border border-[#ebdcb9] hover:border-[#3e2723] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center text-xs font-mono font-bold shadow-sm">TG</div>
              <div>
                <div className="text-xs font-bold text-gray-900">Telegram Channel</div>
                <div className="text-[11px] text-gray-400 font-mono">gholami-furniture</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#3e2723] group-hover:underline">Join &rarr;</span>
          </a>

          {/* باکس ارتباطی لینکدین متصل به آرس دقیق شما */}
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#fbf9f4] border border-[#ebdcb9] hover:border-[#3e2723] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3e2723] text-white flex items-center justify-center text-xs font-mono font-bold shadow-sm">LN</div>
              <div>
                <div className="text-xs font-bold text-gray-900">LinkedIn Executive Profile</div>
                <div className="text-[11px] text-gray-400 font-mono">Mohammad Mehdi Gholami</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#3e2723] group-hover:underline">Connect &rarr;</span>
          </a>

          <div className="p-4 border border-dashed border-[#ebdcb9] bg-[#fbf9f4]/50 text-[11px] text-gray-500 space-y-1">
            <div><span className="font-bold text-gray-700">Workshop Location:</span> Herat, Afghanistan</div>
            <div><span className="font-bold text-gray-700">Operations:</span> Monday to Saturday (08:00 AM - 05:00 PM)</div>
          </div>
        </div>

        {/* ستون سمت راست: فرم ارسال پیام مستقیم متصل به سیستم خطای سرخ */}
        <div className="bg-[#fbf9f4] p-6 border border-[#ebdcb9]">
          <h3 className="font-bold text-[#3e2723] text-xs uppercase tracking-wider mb-4">Send a Message</h3>
          
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 text-xs font-medium text-center h-full flex items-center justify-center">
              Thank you! Your inquiry has been routed to our workshop successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Full Name:</label>
                <input 
                  type="text" 
                  className={`border p-2.5 bg-white focus:outline-none focus:border-[#3e2723] ${errors.name ? 'border-red-500' : 'border-[#ebdcb9]'}`} 
                  value={formData.name} 
                  onChange={e => handleInputChange('name', e.target.value)} 
                />
                {errors.name && <span className="text-[10px] text-red-600 font-medium">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Email Address:</label>
                <input 
                  type="text" 
                  className={`border p-2.5 bg-white text-left focus:outline-none focus:border-[#3e2723] ${errors.email ? 'border-red-500' : 'border-[#ebdcb9]'}`} 
                  value={formData.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                />
                {errors.email && <span className="text-[10px] text-red-600 font-medium">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Message Description:</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe your lumber needs or furniture configurations..."
                  className="border border-[#ebdcb9] bg-white p-2.5 focus:outline-none focus:border-[#3e2723]" 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isFormInvalid}
                className={`w-full font-bold py-2.5 uppercase tracking-wider transition-colors text-white ${isFormInvalid ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' : 'bg-[#3e2723] hover:bg-black shadow-sm'}`}
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
