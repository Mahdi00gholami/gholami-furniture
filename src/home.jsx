import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // آرایه محصولات منتخب با توضیحات و متون انگلیسی
  const featuredItems = [
    { id: "1", title: "Ergonomic Office Chair", roomCategory: "office", material: "Leather & Steel", image: "/chair 1.png", unitPriceAFN: 3500, availableQuantity: 5, description: "Premium orthopedic swivel chair with lumbar support and adjustable height." },
    { id: "2", title: "Modern Executive Desk", roomCategory: "office", material: "Solid MDF", image: "/table 1.png", unitPriceAFN: 6000, availableQuantity: 4, description: "Sleek office workstation featuring integrated cable management holes." },
    { id: "3", title: "Classic Wooden Dining Chair", roomCategory: "dining room", material: "Natural Oak", image: "/chair 2.png", unitPriceAFN: 1500, availableQuantity: 8, description: "Minimalist finely polished timber chair, perfect for elegant dining rooms." }
  ];

  return (
    <div className="w-full pb-16 font-sans text-left" dir="ltr">
      
      {/* هیرو سیکشن تمام‌عرض و بدون فاصله از چپ و راست */}
      <div className="relative w-full h-[550px] sm:h-[650px] bg-gray-100 overflow-hidden mb-12">
        <img 
          src="/home.png" 
          alt="Luxury Interior" 
          className="w-full h-full object-cover object-center"
        />
        
        {/* تراز بندی مستقیم متن‌ها بدون کادر و کارت روی تصویر (دقیقاً در بخش کات‌شده سمت چپ) */}
        <div className="absolute top-1/2 left-8 sm:left-24 transform -translate-y-1/2 max-w-[260px] sm:max-w-xs z-10 flex flex-col pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-[#3e2723] font-black block mb-2 opacity-90">
            Premium Furniture
          </span>
          
          {/* متن شعار با اندازه کنترل‌شده تا دقیقاً در کادر محو فیکس شود و بیرون نزند */}
          <h1 className="text-xl sm:text-3xl font-black text-[#3e2723] leading-tight tracking-wide uppercase font-sans mb-3">
            Better Furniture<br />Better Life
          </h1>
          
          <p className="text-gray-800 text-[11px] sm:text-xs font-medium leading-relaxed mb-6">
            Stylish luxury furniture crafted for every bespoke space, tailor-made for a better living experience.
          </p>
          
          <div className="pointer-events-auto">
            <Link 
              to="/furniture" 
              className="inline-block bg-[#3e2723] text-white hover:bg-black text-[10px] font-bold uppercase tracking-wider px-6 py-3 transition-all rounded-full shadow-md"
            >
              Shop Now &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* کانتینر محدود شده داخلی مخصوص محصولات بخش پایین */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8 border-b border-[#ebdcb9] pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Featured Products</h2>
            <p className="text-xs text-gray-400 mt-0.5">Explore our most popular workshop crafts and furniture record samples</p>
          </div>
          <Link to="/furniture" className="text-xs font-bold uppercase tracking-wider text-[#3e2723] hover:underline flex items-center gap-1">
            View All &rarr;
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-none border border-[#ebdcb9] overflow-hidden flex flex-col md:flex-row h-auto md:h-64 transition-all hover:border-[#3e2723]"
            >
              {/* بخش متون و مشخصات فنی در سمت چپ کارت افقی */}
              <div className="p-6 flex flex-col justify-between flex-grow bg-[#fbf9f4] text-left md:w-1/2">
                <div>
                  <span className="inline-block bg-[#3e2723] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                    {item.roomCategory === 'office' ? 'Office' : 'Dining'}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 tracking-wide mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                </div>

                {/* ردیف آیکون‌ها و فیلدهای عددی انبار و قیمت */}
                <div className="grid grid-cols-3 gap-2 border-t border-[#ebdcb9] pt-4 text-[11px] text-gray-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l8.988-8.118a1.5 1.5 0 0 0-2.312-1.996l-1.077 1.114 1.072-9.404a1.5 1.5 0 0 0-2.775-.82L5.803 12.39a1.5 1.5 0 0 0 2.274 1.942l1.736-2.428Z" />
                    </svg>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase tracking-wider">Material</span>
                      <span className="font-sans font-semibold text-gray-800">{item.material}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase tracking-wider">Unit Price</span>
                      <span className="font-bold text-[#3e2723]">{item.unitPriceAFN.toLocaleString()} AFN</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase tracking-wider">Live Stock</span>
                      <span className="font-bold text-green-700">{item.availableQuantity} units</span>
                    </div>
                  </div>
                </div>

                {/* دکمه See Now جهت هدایت به کاتالوگ مبل‌ها */}
                <div className="mt-4">
                  <Link 
                    to="/furniture" 
                    className="inline-block border border-[#3e2723] text-[#3e2723] hover:bg-[#3e2723] hover:text-white text-[10px] font-bold uppercase tracking-wider px-5 py-2 transition-colors rounded-none"
                  >
                    See Now
                  </Link>
                </div>
              </div>

              {/* تصویر مبل در سمت راست کارت افقی */}
              <div className="w-full md:w-1/2 h-48 md:h-full bg-gray-50 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
