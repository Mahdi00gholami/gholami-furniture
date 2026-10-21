import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from './Footer';
import Navbar from './Navbar';
import Home from './home';
import Furniture from './Furniture';
import Quotation from './Quotation';
import ManageFurniture from './ManageFurniture';
import About from './About';
import Contact from './Contact';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar />
    
    <main className="pt-24 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 text-right" dir="rtl">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/furniture" element={<Furniture />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/manage" element={<ManageFurniture />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
    <Footer/>
  </BrowserRouter>
);
