import React from 'react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-12 font-sans text-left bg-white border border-[#ebdcb9] my-8 relative overflow-hidden" dir="ltr">
      
      {/* بک‌گراند تزئینی ملایم هماهنگ با تم کرم-قهوه‌ای */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4ebd0] opacity-20 transform rotate-45 pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
        
        {/* بخش متون انگلیسی شرکتی و با پرستیژ (۲ بخش از گرید) */}
        <div className="md:col-span-2 space-y-6">
          <div className="border-l-4 border-[#3e2723] pl-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900">About Our Heritage</h2>
            <p className="text-xs text-gray-400 mt-1">Gholami Furniture Workshop — Crafting Excellence Since 1998</p>
          </div>

          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              For nearly three decades, <strong>Gholami Furniture Workshop</strong> has stood as a beacon of bespoke craftsmanship and architectural elegance. Founded on the principles of absolute precision and timeless design, we specialize in transforming raw, premium timber into masterfully tailored furniture components that redefine luxury living.
            </p>
            <p>
              Our heritage is built upon an unwavering commitment to quality. Every ergonomic office chair, solid walnut dining table, and luxury velvet armchair that leaves our workshop undergoes rigorous structural evaluations. We combine traditional European joinery techniques with modern design aesthetics to ensure every record sample delivers lifetime durability.
            </p>
            <p className="text-[#3e2723] font-semibold italic">
              "We don't just assemble wood; we compose the structural signature of your home."
            </p>
          </div>

          {/* امضای مشخصات و آمار لوکس سابقه کاری */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#ebdcb9] font-mono text-center">
            <div className="bg-[#fbf9f4] p-3 border border-[#ebdcb9]">
              <div className="text-xl font-black text-[#3e2723]">25+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Years Experience</div>
            </div>
            <div className="bg-[#fbf9f4] p-3 border border-[#ebdcb9]">
              <div className="text-xl font-black text-[#3e2723]">10K+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Bespoke Crafts</div>
            </div>
            <div className="bg-[#fbf9f4] p-3 border border-[#ebdcb9]">
              <div className="text-xl font-black text-[#3e2723]">100%</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Premium Oak</div>
            </div>
          </div>
        </div>

        {/* بخش نمایش لوگوی بزرگ شما در گوشه صفحه (۱ بخش از گرید) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-[#f4ebd0] border border-[#ebdcb9] shadow-inner h-full min-h-[280px]">
          <div className="rounded-full border-4 border-[#3e2723] p-2 bg-[#f4ebd0] shadow-md transition-transform duration-500 hover:scale-105">
            <img 
              src="/logo1.png" 
              alt="Gholami Furniture Seal of Quality" 
              className="w-32 h-32 object-contain rounded-full"
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#3e2723] font-black mt-4 text-center">
            Official Seal <br /> of Quality
          </span>
        </div>

      </div>
    </div>
  );
}
