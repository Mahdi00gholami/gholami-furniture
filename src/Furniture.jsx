import React, { useState, useEffect } from 'react';
import { FurnitureCard } from './FurnitureCard';

export default function Furniture() {
  const defaultItems = [
    { id: "1", title: "Ergonomic Office Chair", roomCategory: "office", material: "Leather & Steel", image: "/chair 1.png", unitPriceAFN: 3500, availableQuantity: 5, description: "Premium orthopedic swivel chair with lumbar support and adjustable height." },
    { id: "2", title: "Modern Executive Desk", roomCategory: "office", material: "Solid MDF", image: "/table 1.png", unitPriceAFN: 6000, availableQuantity: 4, description: "Sleek office workstation featuring integrated cable management holes." },
    { id: "3", title: "Classic Wooden Dining Chair", roomCategory: "dining room", material: "Natural Oak", image: "/chair 2.png", unitPriceAFN: 1500, availableQuantity: 8, description: "Minimalist finely polished timber chair, perfect for elegant dining rooms." },
    { id: "4", title: "Robust Workshop Dining Table", roomCategory: "dining room", material: "Walnut Wood", image: "/table 2.png", unitPriceAFN: 4000, availableQuantity: 3, description: "Sturdy artisan crafted dining table designed for family gatherings." },
    { id: "5", title: "Luxury Accent Armchair", roomCategory: "living room", material: "Velvet Fabric", image: "/furniture 3.png", unitPriceAFN: 9500, availableQuantity: 6, description: "Ultra-soft single sofa seat equipped with high-density comfort foam." },
    { id: "6", title: "Modern Living Room Sectional", roomCategory: "living room", material: "Premium Linen", image: "/furniture 4.png", unitPriceAFN: 24000, availableQuantity: 2, description: "Contemporary style spacious sofa set tailored for luxury living spaces." }
  ];

  const [furnitureItems, setFurnitureItems] = useState(defaultItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortByPrice, setSortByPrice] = useState('none');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('workshop_furniture_items');
    
    if (savedItems) {
      setFurnitureItems(JSON.parse(savedItems));
    } else {
      localStorage.setItem('workshop_furniture_items', JSON.stringify(defaultItems));
    }
  }, []);

  // تابع واحد و ساده: با هر کلیک یکی از انبار کم می‌کند و یکی به سبد پیش‌فاکتور اضافه می‌کند
  const handleAddToCart = (id) => {
    // ۱. کم کردن مستقیم از موجودی انبار کاتالوگ
    const updatedItems = furnitureItems.map(item => {
      if (item.id === id && item.availableQuantity > 0) {
        return { ...item, availableQuantity: item.availableQuantity - 1 };
      }
      return item;
    });
    setFurnitureItems(updatedItems);
    localStorage.setItem('workshop_furniture_items', JSON.stringify(updatedItems));

    // ۲. افزودن مستقیم تعداد در سبد خرید پیش‌فاکتور (Quotation)
    const currentCart = JSON.parse(localStorage.getItem('furniture_cart') || '{}');
    currentCart[id] = (currentCart[id] || 0) + 1;
    localStorage.setItem('furniture_cart', JSON.stringify(currentCart));
  };

  const filteredItems = furnitureItems
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => selectedCategory === 'all' || item.roomCategory === selectedCategory)
    .filter(item => !showOnlyAvailable || item.availableQuantity > 0)
    .sort((a, b) => {
      if (sortByPrice === 'asc') return a.unitPriceAFN - b.unitPriceAFN;
      if (sortByPrice === 'desc') return b.unitPriceAFN - a.unitPriceAFN;
      return 0;
    });
  return (
    <div className="max-w-7xl mx-auto p-6 font-sans text-left" dir="ltr">
      {/* تیتر بالای کاتالوگ با استایل لوکس کلاسیک */}
      <div className="mb-8 border-l-4 border-[#3e2723] pl-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Our Furniture Collection</h2>
        <p className="text-xs text-gray-400 mt-1">Select products for your custom quotation. Workshop stock updates instantly.</p>
      </div>

      {/* نوار ابزار جستجو و فیلترها (RoomFilters) با تم کرم و قهوه‌ای مینی‌مال */}
      <div className="bg-[#f4ebd0] p-4 border border-[#ebdcb9] flex flex-col md:flex-row gap-4 mb-8 text-xs">
        <input
          type="text"
          placeholder="Search furniture..."
          className="bg-white border border-[#ebdcb9] rounded-none px-3 py-2 flex-grow focus:outline-none focus:border-[#3e2723] text-left text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-white border border-[#ebdcb9] rounded-none px-3 py-2 focus:outline-none focus:border-[#3e2723] text-left text-gray-700 font-medium"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Rooms</option>
          <option value="living room">Living Room</option>
          <option value="dining room">Dining Room</option>
          <option value="office">Office Space</option>
        </select>
        <select
          className="bg-white border border-[#ebdcb9] rounded-none px-3 py-2 focus:outline-none focus:border-[#3e2723] text-left text-gray-700 font-medium"
          value={sortByPrice}
          onChange={(e) => setSortByPrice(e.target.value)}
        >
          <option value="none">No Price Sorting</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer py-2 whitespace-nowrap text-gray-700 font-semibold">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="w-4 h-4 rounded-none accent-[#3e2723]"
          />
          <span>Show In-Stock Only</span>
        </label>
      </div>

      {/* نمایش گرید ریسپانسیو کارت‌ها متصل به کامپوننت FurnitureCard جدید */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <FurnitureCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
