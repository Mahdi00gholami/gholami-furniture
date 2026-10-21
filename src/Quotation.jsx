import React, { useState, useEffect } from 'react';

export default function Quotation() {
  // ۱. استیت آرایه محصولات مرجع کارگاه مبلمان
  const [furnitureItems, setFurnitureItems] = useState([
    { id: "1", title: "Ergonomic Office Chair", roomCategory: "office", material: "Leather & Steel", image: "/chair 1.png", unitPriceAFN: 3500, availableQuantity: 5, description: "Premium orthopedic swivel chair with lumbar support and adjustable height." },
    { id: "2", title: "Modern Executive Desk", roomCategory: "office", material: "Solid MDF", image: "/table 1.png", unitPriceAFN: 6000, availableQuantity: 4, description: "Sleek office workstation featuring integrated cable management holes." },
    { id: "3", title: "Classic Wooden Dining Chair", roomCategory: "dining room", material: "Natural Oak", image: "/chair 2.png", unitPriceAFN: 1500, availableQuantity: 8, description: "Minimalist finely polished timber chair, perfect for elegant dining rooms." },
    { id: "4", title: "Robust Workshop Dining Table", roomCategory: "dining room", material: "Walnut Wood", image: "/table 2.png", unitPriceAFN: 4000, availableQuantity: 3, description: "Sturdy artisan crafted dining table designed for family gatherings." },
    { id: "5", title: "Luxury Accent Armchair", roomCategory: "living room", material: "Velvet Fabric", image: "/furniture 3.png", unitPriceAFN: 9500, availableQuantity: 6, description: "Ultra-soft single sofa seat equipped with high-density comfort foam." },
    { id: "6", title: "Modern Living Room Sectional", roomCategory: "living room", material: "Premium Linen", image: "/furniture 4.png", unitPriceAFN: 24000, availableQuantity: 2, description: "Contemporary style spacious sofa set tailored for luxury living spaces." }
  ]);

  const [cart, setCart] = useState({});
  const [includeFinishing, setIncludeFinishing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ alias: '', email: '', date: '', notes: '' });
  const [errors, setErrors] = useState({ alias: '', email: '' });
  
  // تغییر استیت به آرایه برای ذخیره و نمایش لیست فاکتورهای متعدد
  const [invoicesList, setInvoicesList] = useState([]);

  // ۲. بارگذاری داده‌های زنده و لیست فاکتورهای ذخیره شده قبلی از لوکال استوریج
  useEffect(() => {
    const savedItems = localStorage.getItem('workshop_furniture_items');
    const savedCart = JSON.parse(localStorage.getItem('furniture_cart') || '{}');
    const savedInvoices = JSON.parse(localStorage.getItem('furniture_invoices_list') || '[]');
    
    setCart(savedCart);
    setInvoicesList(savedInvoices);

    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      const formattedItems = parsedItems.map(f => ({
        ...f,
        unitPriceAFN: Number(f.unitPriceAFN),
        availableQuantity: Number(f.availableQuantity)
      }));
      setFurnitureItems(formattedItems);
    }
  }, []);

  // ۳. مدیریت تعاملی و برعکس تعداد اقلام فاکتور با انبار کاتالوگ
  const updateQuantity = (id, amount) => {
    const item = furnitureItems.find(f => f.id === id);
    if (!item) return;

    if (amount > 0 && item.availableQuantity <= 0) {
      alert(`Error: No more stock available in workshop!`);
      return;
    }

    const updatedCart = { ...cart };
    const newQty = (cart[id] || 0) + amount;
    
    if (newQty <= 0) {
      delete updatedCart[id];
    } else {
      updatedCart[id] = newQty;
    }
    setCart(updatedCart);
    localStorage.setItem('furniture_cart', JSON.stringify(updatedCart));

    const updatedItems = furnitureItems.map(f => {
      if (f.id === id) {
        return { ...f, availableQuantity: f.availableQuantity - amount };
      }
      return f;
    });
    setFurnitureItems(updatedItems);
    localStorage.setItem('workshop_furniture_items', JSON.stringify(updatedItems));
  };
  // دکمه عملکرد: پاک کردن کل لیست پیش‌نویس فعلی و بازگرداندن تعداد کالاها به انبار
  const resetCart = () => {
    const updatedItems = furnitureItems.map(f => {
      const reservedQty = cart[f.id] || 0;
      return { ...f, availableQuantity: f.availableQuantity + reservedQty };
    });
    setFurnitureItems(updatedItems);
    localStorage.setItem('workshop_furniture_items', JSON.stringify(updatedItems));

    setCart({});
    localStorage.setItem('furniture_cart', JSON.stringify({}));
    setIncludeFinishing(false);
  };

  // دکمه عملکرد جدید: حذف یک پیش‌فاکتور خاص از لیست فاکتورهای صادر شده بدون تغییر در انبار
  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this specific quotation record?')) {
      const updatedList = invoicesList.filter(inv => inv.id !== invoiceId);
      setInvoicesList(updatedList);
      localStorage.setItem('furniture_invoices_list', JSON.stringify(updatedList));
    }
  };

  // اعتبارسنجی زنده ورودی‌های فرم به زبان انگلیسی
  const handleInputChange = (field, value) => {
    const updatedInfo = { ...customerInfo, [field]: value };
    setCustomerInfo(updatedInfo);
    const updatedErrors = { ...errors };

    if (field === 'alias') {
      if (value.trim().length < 3) updatedErrors.alias = 'Name must be at least 3 characters.';
      else updatedErrors.alias = '';
    }

    if (field === 'email') {
      const hasAt = value.includes('@');
      const hasDot = value.includes('.');
      if (value.trim() && (!hasAt || !hasDot || value.length < 5)) {
        updatedErrors.email = 'Invalid email format (e.g. name@domain.com).';
      } else updatedErrors.email = '';
    }
    setErrors(updatedErrors);
  };

  // محاسبات مالی پیش‌فاکتور جاری به افغانی
  const subtotal = Object.keys(cart).reduce((sum, id) => {
    const item = furnitureItems.find(f => f.id === id);
    return sum + (item ? item.unitPriceAFN * cart[id] : 0);
  }, 0);

  const finishingCost = includeFinishing ? subtotal * 0.10 : 0;
  const finalEstimate = subtotal + finishingCost;

  const isFormInvalid = errors.alias || errors.email || !customerInfo.alias.trim() || !customerInfo.email.trim();

  // تابع عملکرد دکمه ارسال: ذخیره فاکتور جدید در انتهای لیست ماندگار لوکال استوریج (زیر قبلی‌ها)
  const handleSendQuote = () => {
    if (isFormInvalid) return;

    const invoiceProducts = Object.keys(cart).map(id => {
      const item = furnitureItems.find(f => f.id === id);
      return {
        title: item?.title || 'Unknown Item',
        image: item?.image || '',
        price: item?.unitPriceAFN || 0,
        qty: cart[id]
      };
    });

    const newInvoice = {
      id: Date.now().toString(), // شناسه منحصربه‌فرد برای هر فاکتور جهت حذف آسان
      customer: { ...customerInfo },
      products: invoiceProducts,
      subtotal: subtotal,
      finishing: finishingCost,
      total: finalEstimate
    };

    // متصل کردن فاکتور جدید به لیست فاکتورهای قبلی و ذخیره ماندگار
    const updatedInvoicesList = [...invoicesList, newInvoice];
    setInvoicesList(updatedInvoicesList);
    localStorage.setItem('furniture_invoices_list', JSON.stringify(updatedInvoicesList));

    // ریست کردن سبد خرید و فیلدهای فرم جاری بدون تغییر در انبار کاتالوگ
    setCart({});
    localStorage.setItem('furniture_cart', JSON.stringify({}));
    setCustomerInfo({ alias: '', email: '', date: '', notes: '' });
    setIncludeFinishing(false);
    alert('Quotation generated successfully and added to the historical records below.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-left" dir="ltr">
      <div className="mb-8 border-l-4 border-[#3e2723] pl-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Quotation Planner</h2>
        <p className="text-xs text-gray-400 mt-1">Review selected items, apply options, and generate a formal project estimation</p>
      </div>

      {subtotal === 0 && invoicesList.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-none border border-[#ebdcb9] text-gray-500 text-xs">
          Your quotation list is empty. Please select products from the furniture catalog.
        </div>
      ) : (
        subtotal > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white p-4 rounded-none border border-[#ebdcb9] flex flex-col gap-4">
              <h3 className="font-bold text-[#3e2723] border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">Selected Furniture</h3>
              {Object.keys(cart).map(id => {
                const item = furnitureItems.find(f => f.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="flex justify-between items-center bg-[#fbf9f4] p-3 border border-[#ebdcb9] text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-none bg-white border border-[#ebdcb9]" />
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Unit Price: {item.unitPriceAFN.toLocaleString()} AFN</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3" dir="ltr">
                      <button type="button" onClick={() => updateQuantity(id, -1)} className="w-6 h-6 bg-white border border-[#ebdcb9] rounded-full font-mono font-bold hover:bg-red-50 text-[#3e2723]">-</button>
                      <span className="font-mono font-black text-gray-800">{cart[id]} pcs</span>
                      <button type="button" onClick={() => updateQuantity(id, 1)} className="w-6 h-6 bg-white border border-[#ebdcb9] rounded-full font-mono font-bold hover:bg-green-50 text-[#3e2723]">+</button>
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={resetCart} className="text-[10px] font-bold text-red-700 uppercase tracking-wider hover:underline self-start mt-2">Clear and Cancel All Reservations</button>
            </div>

            <div className="bg-white p-4 rounded-none border border-[#ebdcb9] flex flex-col gap-4 text-xs">
              <h3 className="font-bold text-[#3e2723] border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">Estimate Summary</h3>
              <div className="flex justify-between font-mono"><span>Items Subtotal:</span><span className="font-bold text-gray-900">{subtotal.toLocaleString()} AFN</span></div>
              
              <label className="flex items-center gap-2 bg-[#f4ebd0] p-2.5 border border-[#ebdcb9] cursor-pointer">
                <input type="checkbox" checked={includeFinishing} onChange={(e) => setIncludeFinishing(e.target.checked)} className="w-4 h-4 accent-[#3e2723]" />
                <span className="text-[11px] text-[#3e2723] font-bold">Apply Finishing & Polish (10%)</span>
              </label>

              <div className="flex justify-between text-gray-400 font-mono"><span>Finishing Surcharge:</span><span>{finishingCost.toLocaleString()} AFN</span></div>
              <div className="flex justify-between text-sm font-black text-[#3e2723] border-t border-[#ebdcb9] pt-3 font-mono"><span>Final Estimate:</span><span>{finalEstimate.toLocaleString()} AFN</span></div>
            </div>
          </div>
        )
      )}
      {/* فرم مشخصات متقاضی فاکتور جاری */}
      {subtotal > 0 && (
        <div className="bg-white p-5 rounded-none border border-[#ebdcb9] text-xs mb-8">
          <h3 className="font-bold text-[#3e2723] mb-4 border-b border-[#f3eee1] pb-2 uppercase tracking-wider">Applicant Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Customer Alias Name:</label>
              <input
                type="text"
                placeholder="Minimum 3 characters"
                className={`border p-2 bg-[#fbf9f4] focus:outline-none focus:border-[#3e2723] ${errors.alias ? 'border-red-500' : 'border-[#ebdcb9]'}`}
                value={customerInfo.alias}
                onChange={e => handleInputChange('alias', e.target.value)}
              />
              {errors.alias && <span className="text-[10px] text-red-500 font-medium">{errors.alias}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Email Address:</label>
              <input
                type="text"
                placeholder="name@domain.com"
                className={`border p-2 bg-[#fbf9f4] text-left focus:outline-none focus:border-[#3e2723] ${errors.email ? 'border-red-500' : 'border-[#ebdcb9]'}`}
                value={customerInfo.email}
                onChange={e => handleInputChange('email', e.target.value)}
              />
              {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Project Deadline Date:</label>
              <input
                type="date"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 text-left focus:outline-none focus:border-[#3e2723]"
                value={customerInfo.date}
                onChange={e => handleInputChange('date', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-semibold text-gray-600">Technical Specifications & Notes:</label>
            <textarea
              placeholder="Enter special structural requests, fabric colors, or project modifications..."
              rows="2"
              className="w-full border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]"
              value={customerInfo.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
            ></textarea>
          </div>
          
          <button
            type="button"
            onClick={handleSendQuote}
            disabled={isFormInvalid}
            className={`font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all text-white ${isFormInvalid ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' : 'bg-[#3e2723] hover:bg-black shadow-sm'}`}
          >
            Submit and Generate Quotation
          </button>
        </div>
      )}

      {/* نمایش لیست تمام پیش‌فاکتورهای صادرشده قبلی (زیر یکدیگر و با قابلیت ماندگاری) */}
      {invoicesList.length > 0 && (
        <div className="mt-12 space-y-8">
          <div className="border-b border-[#3e2723] pb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#3e2723]">Historical Quotation Records ({invoicesList.length})</h3>
          </div>
          
          {invoicesList.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-none border-2 border-[#3e2723] p-6 shadow-md font-sans text-left relative transition-all">
              
              {/* بخش بالایی هر سند رسمی */}
              <div className="flex justify-between items-center border-b-2 border-[#3e2723] pb-4 mb-6">
                <div>
                  <h4 className="text-base font-black uppercase tracking-widest text-gray-900">Official Project Quotation</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Gholami Furniture Workshop Ltd.</p>
                </div>
                <div className="text-right text-[10px] font-mono text-gray-500 mr-8">
                  <div>Date: {invoice.customer.date || 'Not specified'}</div>
                  <div className="font-bold text-[#3e2723]">Quotation ID: #{invoice.id.slice(-6)}</div>
                </div>
              </div>

              {/* دکمه اختصاصی حذف پیش‌فاکتور در سمت راست بالا */}
              <button
                type="button"
                onClick={() => handleDeleteInvoice(invoice.id)}
                className="absolute bottom-4 left-6 bg-red-600 text-white hover:bg-red-700 font-bold text-sm uppercase tracking-wider px-5 py-2.5 transition-all shadow-sm
"
              >
                Delete Record
              </button>

              {/* اطلاعات متقاضی سند */}
              <div className="bg-[#fbf9f4] border border-[#ebdcb9] p-3 text-xs mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Client Name:</span> <span className="font-bold text-gray-900">{invoice.customer.alias}</span></div>
                <div><span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Client Email:</span> <span className="font-mono text-gray-800">{invoice.customer.email}</span></div>
                <div className="sm:col-span-2 border-t border-[#ebdcb9] border-dashed pt-2 mt-1">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Technical Notes:</span>
                  <p className="text-gray-700 italic">{invoice.customer.notes || 'No custom modifications requested.'}</p>
                </div>
              </div>

              {/* اقلام خریداری‌شده همراه با عکس بندانگشتی محلی */}
              <div className="space-y-3 mb-6">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#3e2723] mb-2">Itemized Estimate Breakdown</h5>
                {invoice.products.map((prod, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-8 h-8 object-cover border border-[#ebdcb9] bg-white rounded-none" />
                      <div>
                        <div className="font-bold text-gray-800">{prod.title}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{prod.qty} units x {prod.price.toLocaleString()} AFN</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900">{(prod.price * prod.qty).toLocaleString()} AFN</span>
                  </div>
                ))}
              </div>

              {/* برآورد محاسباتی نهایی */}
              <div className="border-t border-[#3e2723] pt-4 flex flex-col items-end gap-1.5 text-xs font-mono">
                <div className="w-full sm:w-64 flex justify-between text-gray-500"><span>Subtotal:</span><span>{invoice.subtotal.toLocaleString()} AFN</span></div>
                <div className="w-full sm:w-64 flex justify-between text-gray-500"><span>Finishing & Polish (10%):</span><span>{invoice.finishing.toLocaleString()} AFN</span></div>
                <div className="w-full sm:w-64 flex justify-between text-sm font-black text-[#3e2723] border-t border-dashed border-[#ebdcb9] pt-2 mt-1">
                  <span>Total Estimate:</span><span>{invoice.total.toLocaleString()} AFN</span>
                </div>
              </div>

             

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
