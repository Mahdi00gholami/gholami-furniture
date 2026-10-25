import React, { useState, useEffect } from 'react';
import { FurnitureCard } from './FurnitureCard';
import { configMessage, fromProductRow, getCartId, supabase, supabaseReady } from './supabase';

export default function Furniture() {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortByPrice, setSortByPrice] = useState('none');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    if (!supabaseReady) return;
    supabase.from('furniture_items').select('*').order('id').then(({ data, error }) => {
      if (error) { window.alert(error.message); return; }
      setFurnitureItems(data.map(fromProductRow));
    });
  }, []);

  // تابع واحد و ساده: با هر کلیک یکی از انبار کم می‌کند و یکی به سبد پیش‌فاکتور اضافه می‌کند
  const handleAddToCart = async (id) => {
    // ۱. کم کردن مستقیم از موجودی انبار کاتالوگ
    const { data, error } = await supabase.rpc('adjust_cart', { p_cart_id: getCartId(), p_item_id: String(id), p_delta: 1 });
    if (error) { window.alert(error.message); return; }
    setFurnitureItems(items => items.map(item => item.id === String(id) ? { ...item, availableQuantity: data.available_quantity } : item));

    // ۲. افزودن مستقیم تعداد در سبد خرید پیش‌فاکتور (Quotation)
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
      {!supabaseReady && <p className="mb-4 text-xs text-red-600">{configMessage()}</p>}
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
