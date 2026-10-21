import React from 'react';

export function FurnitureCard({ item, onAddToCart }) {
  return (
    // بدنه کارت: لبه‌های کاملاً تیز فلت، هماهنگ با تم کرم و قهوه‌ای لوکس نو‌بار شما
    <div className="bg-white rounded-none border border-[#ebdcb9] overflow-hidden flex flex-col h-full transition-all hover:border-[#3e2723] text-left font-sans" dir="ltr">
      
      {/* بخش نمایش عکس مبل با برچسب دسته‌بندی مینی‌مال */}
      <div className="relative w-full h-56 bg-gray-50 rounded-none overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-[#3e2723] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          {item.roomCategory === 'living room' ? 'Living' : item.roomCategory === 'dining room' ? 'Dining' : 'Office'}
        </span>
      </div>

      {/* محتوای متنی و جزئیات مبل به زبان انگلیسی */}
      <div className="p-4 flex flex-col flex-grow bg-[#fbf9f4]">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide line-clamp-1">{item.title}</h3>
          <span className="text-[10px] text-gray-600 bg-[#f4ebd0] border border-[#ebdcb9] px-2 py-0.5 font-medium rounded-none whitespace-nowrap">
            {item.material}
          </span>
        </div>

        <p className="text-gray-500 text-xs mb-4 leading-relaxed line-clamp-2 flex-grow">
          {item.description}
        </p>

        {/* قیمت و موجودی زنده انبار نمونه */}
        <div className="border-t border-[#ebdcb9] pt-3 mt-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-400 text-[11px] uppercase tracking-wider">Unit Price:</div>
            <div className="text-sm font-black text-[#3e2723] font-mono">
              {Number(item.unitPriceAFN).toLocaleString()} <span className="text-[10px] font-normal text-gray-500">AFN</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 text-span text-[11px] text-gray-400">
            <span className="uppercase tracking-wider">Workshop Stock:</span>
            <span className={`font-mono font-bold ${item.availableQuantity === 0 ? 'text-red-600' : 'text-green-700'}`}>
              {item.availableQuantity} units
            </span>
          </div>

          {/* دکمه واحد کپسولی: با هر کلیک یکی کم می‌کند و اگر صفر شود قفل (Out of Stock) می‌شود */}
          <button
            onClick={() => onAddToCart(item.id)}
            disabled={item.availableQuantity === 0}
            className={`w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              item.availableQuantity === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#3e2723] text-white hover:bg-black shadow-sm'
            }`}
          >
            {item.availableQuantity === 0 ? 'Out of Stock' : 'Add to Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
