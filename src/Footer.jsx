import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1e1412] text-[#f4ebd0] border-t border-[#ebdcb9] mt-auto font-sans text-left" dir="ltr">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
        
        {/* Column 1: Brand & Craftsmanship Statement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-[#ebdcb9] overflow-hidden bg-[#f4ebd0] p-0.5 flex items-center justify-center">
              <img src="/logo1.png" alt="Gholami Mini Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-sans font-black tracking-widest text-sm text-white">GHOLAMI LAB</span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-xs">
            Bespoke wood craftsmanship and architectural premium furniture design. Shaping timeless interiors since 1998.
          </p>
        </div>

        {/* Column 2: Navigation Links using NavLink */}
        <div className="space-y-2">
          <h4 className="text-white font-bold uppercase tracking-wider border-b border-[#3e2723] pb-1.5 mb-3 text-[11px]">Quick Navigation</h4>
          <div className="grid grid-cols-2 gap-2">
            <NavLink to="/" className="text-gray-400 hover:text-white transition-colors">&rarr; Home</NavLink>
            <NavLink to="/furniture" className="text-gray-400 hover:text-white transition-colors">&rarr; Furniture</NavLink>
            <NavLink to="/quotation" className="text-gray-400 hover:text-white transition-colors">&rarr; Quotation</NavLink>
            <NavLink to="/manage" className="text-gray-400 hover:text-white transition-colors">&rarr; Management</NavLink>
            <NavLink to="/about" className="text-gray-400 hover:text-white transition-colors">&rarr; About Us</NavLink>
            <NavLink to="/contact" className="text-gray-400 hover:text-white transition-colors">&rarr; Contact</NavLink>
          </div>
        </div>

        {/* Column 3: Contact & Educational Verification */}
        <div className="space-y-2 text-gray-400 font-mono">
          <h4 className="text-white font-bold uppercase tracking-wider border-b border-[#3e2723] pb-1.5 mb-3 text-[11px] font-sans">Workshop Service</h4>
          <div>Location: Herat, Afghanistan</div>
          <div>Support: +93 782 362 355</div>
         
        </div>

      </div>

      {/* Bottom Copyright Strip with formal name signature */}
      <div className="w-full bg-[#120a09] border-t border-[#3e2723] py-4 text-center text-[10px] text-gray-500 font-mono">
        &copy; {new Date().getFullYear()} Gholami Furniture. Crafted by Mohammad Mehdi Gholami.
      </div>
    </footer>
  );
}
