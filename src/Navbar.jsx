import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  // استیت باز و بسته شدن منوی همبرگری در موبایل
  const [isOpen, setIsOpen] = useState(false);

  // استایل دکمه‌های ناوبری دسکتاپ (دکمه کپسولی تیره برای صفحه فعال)
  const checkActive = ({ isActive }) =>
    isActive
      ? "bg-[#3e2723] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm"
      : "text-[#3e2723] hover:text-black text-xs font-semibold tracking-wide transition-colors";

  // border-600 استایل دکمه‌های فعال در حالت منوی موبایل
  const checkActiveMobile = ({ isActive }) =>
    isActive
      ? "bg-[#3e2723] text-white w-full text-center py-2.5 rounded-none font-bold text-sm block"
      : "text-[#3e2723] hover:bg-[#ebdcb9] w-full text-center py-2.5 font-semibold text-sm block";

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#f4ebd0] border-b border-[#ebdcb9] z-50 px-6 sm:px-12 flex items-center justify-between font-sans" dir="ltr">
      
      {/* بخش سمت چپ: تصویر لوگو همراه با بوردر دایره‌ای تیره */}
      <div className="flex items-center">
        <div className="p-1 rounded-full border-2 border-[#3e2723] bg-[#f4ebd0] flex items-center justify-center">
          <img 
            src="/logo1.png" 
            alt="Gholami Furniture Logo" 
            className="h-12 w-12 object-contain rounded-full"
          />
        </div>
      </div>

      {/* بخش وسط: منوی ناوبری دسکتاپ (دقیقا در وسط صفحه فیکس شده است) */}
      <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
        <NavLink to="/" className={checkActive}>Home</NavLink>
        <NavLink to="/furniture" className={checkActive}>Furniture</NavLink>
        <NavLink to="/quotation" className={checkActive}>Quotation</NavLink>
        <NavLink to="/manage" className={checkActive}>Manage Furniture</NavLink>
        <NavLink to="/about" className={checkActive}>About</NavLink>
        <NavLink to="/contact" className={checkActive}>Contact</NavLink>
      </div>

      {/* بخش سمت راست: دکمه منوی همبرگری موبایل (آیکون‌های سرچ و پروفایل حذف شدند) */}
      <div className="flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#3e2723] hover:text-black focus:outline-none"
        >
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* کشوی منوی ریسپانسیو موبایل */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#f4ebd0] border-b border-[#ebdcb9] shadow-lg flex flex-col items-center md:hidden z-40 transition-all">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={checkActiveMobile}>Home</NavLink>
          <NavLink to="/furniture" onClick={() => setIsOpen(false)} className={checkActiveMobile}>Furniture</NavLink>
          <NavLink to="/quotation" onClick={() => setIsOpen(false)} className={checkActiveMobile}>Quotation</NavLink>
          <NavLink to="/manage" onClick={() => setIsOpen(false)} className={checkActiveMobile}>Manage Furniture</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className={checkActiveMobile}>About</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className={checkActiveMobile}>Contact</NavLink>
        </div>
      )}
    </nav>
  );
}
