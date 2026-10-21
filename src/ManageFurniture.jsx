import React, { useState, useEffect } from 'react';

export default function ManageFurniture() {
  const defaultItems = [
    { id: "1", title: "Ergonomic Office Chair", roomCategory: "office", material: "Leather & Steel", image: "/chair 1.png", unitPriceAFN: 3500, availableQuantity: 5, description: "Premium orthopedic swivel chair with lumbar support and adjustable height." },
    { id: "2", title: "Modern Executive Desk", roomCategory: "office", material: "Solid MDF", image: "/table 1.png", unitPriceAFN: 6000, availableQuantity: 4, description: "Sleek office workstation featuring integrated cable management holes." },
    { id: "3", title: "Classic Wooden Dining Chair", roomCategory: "dining room", material: "Natural Oak", image: "/chair 2.png", unitPriceAFN: 1500, availableQuantity: 8, description: "Minimalist finely polished timber chair, perfect for elegant dining rooms." },
    { id: "4", title: "Robust Workshop Dining Table", roomCategory: "dining room", material: "Walnut Wood", image: "/table 2.png", unitPriceAFN: 4000, availableQuantity: 3, description: "Sturdy artisan crafted dining table designed for family gatherings." },
    { id: "5", title: "Luxury Accent Armchair", roomCategory: "living room", material: "Velvet Fabric", image: "/furniture 3.png", unitPriceAFN: 9500, availableQuantity: 6, description: "Ultra-soft single sofa seat equipped with high-density comfort foam." },
    { id: "6", title: "Modern Living Room Sectional", roomCategory: "living room", material: "Premium Linen", image: "/furniture 4.png", unitPriceAFN: 24000, availableQuantity: 2, description: "Contemporary style spacious sofa set tailored for luxury living spaces." }
  ];

  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ id: '', title: '', roomCategory: 'living room', material: '', image: '', unitPriceAFN: '', availableQuantity: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const savedItems = localStorage.getItem('workshop_furniture_items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(defaultItems);
      localStorage.setItem('workshop_furniture_items', JSON.stringify(defaultItems));
    }
  }, []);

  const saveToStorage = (updatedItems) => {
    setItems(updatedItems);
    localStorage.setItem('workshop_furniture_items', JSON.stringify(updatedItems));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.material.trim()) errors.material = 'Material is required.';
    if (!formData.image.trim()) errors.image = 'Image online URL is required.';

    const price = Number(formData.unitPriceAFN);
    if (!formData.unitPriceAFN || isNaN(price) || price <= 0) {
      errors.unitPriceAFN = 'Price must be a positive number.';
    }

    const qty = Number(formData.availableQuantity);
    if (formData.availableQuantity === '' || isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      errors.availableQuantity = 'Stock must be a whole number (>= 0).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // قالب‌بندی عددی داده‌ها برای همخوانی ۱۰۰٪ با شروط ناموجودی کارت کاتالوگ
    const formattedData = {
      ...formData,
      unitPriceAFN: Number(formData.unitPriceAFN),
      availableQuantity: Number(formData.availableQuantity)
    };

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? { ...formattedData, id: editingId } : item);
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newItem = { ...formattedData, id: Date.now().toString() };
      saveToStorage([...items, newItem]);
    }

    setFormData({ id: '', title: '', roomCategory: 'living room', material: '', image: '', unitPriceAFN: '', availableQuantity: '', description: '' });
    setFormErrors({});
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setFormErrors({});
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Delete this furniture from workshop catalog?')) {
      const filtered = items.filter(item => item.id !== id);
      saveToStorage(filtered);
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-left" dir="ltr">
      {/* تیتر صفحه مدیریت با لبه خط پهلو قهوه‌ای تیره */}
      <div className="mb-8 border-l-4 border-[#3e2723] pl-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Workshop Inventory Management</h2>
        <p className="text-xs text-gray-400 mt-1">Create, edit, or delete furniture records and update live stock levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* فرم ثبت و ویرایش اطلاعات کالا */}
        <div className="bg-white p-5 rounded-none border border-[#ebdcb9] h-fit">
          <h3 className="font-bold text-[#3e2723] mb-4 border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">
            {editingId ? 'Edit Furniture Record' : 'Add New Furniture'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Furniture Title:</label>
              <input type="text" className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              {formErrors.title && <span className="text-[10px] text-red-600 font-medium">{formErrors.title}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Room Category:</label>
              <select className="border border-[#ebdcb9] bg-white p-2 focus:outline-none focus:border-[#3e2723]" value={formData.roomCategory} onChange={e => setFormData({...formData, roomCategory: e.target.value})}>
                <option value="living room">Living Room</option>
                <option value="dining room">Dining Room</option>
                <option value="office">Office Space</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Material Type:</label>
              <input type="text" className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} />
              {formErrors.material && <span className="text-[10px] text-red-600 font-medium">{formErrors.material}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Online Image URL (Local or Remote):</label>
              <input 
                type="text" 
                placeholder="/chair 1.png or URL" 
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]" 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
              />
              {formErrors.image && <span className="text-[10px] text-red-600 font-medium">{formErrors.image}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Unit Price (AFN):</label>
              <input type="number" className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 text-left focus:outline-none focus:border-[#3e2723]" value={formData.unitPriceAFN} onChange={e => setFormData({...formData, unitPriceAFN: e.target.value})} />
              {formErrors.unitPriceAFN && <span className="text-[10px] text-red-600 font-medium">{formErrors.unitPriceAFN}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Available Workshop Quantity:</label>
              <input type="number" className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 text-left focus:outline-none focus:border-[#3e2723]" value={formData.availableQuantity} onChange={e => setFormData({...formData, availableQuantity: e.target.value})} />
              {formErrors.availableQuantity && <span className="text-[10px] text-red-600 font-medium">{formErrors.availableQuantity}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Description:</label>
              <textarea rows="2" className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-grow bg-[#3e2723] hover:bg-black text-white font-bold py-2 rounded-none transition-colors uppercase tracking-wider text-[11px]">
                {editingId ? 'Update Record' : 'Save Item'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ id: '', title: '', roomCategory: 'living room', material: '', image: '', unitPriceAFN: '', availableQuantity: '', description: '' }); setFormErrors({}); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-none font-bold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* جدول ادمین برای نمایش، حذف و تغییرات مبل‌ها */}
        <div className="lg:col-span-2 bg-white p-5 rounded-none border border-[#ebdcb9] overflow-x-auto shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">Active Inventory Database</h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f4ebd0] text-[#3e2723] border-b border-[#ebdcb9]">
                <th className="p-3">Product Details</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Live Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-[#fbf9f4]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-none bg-white border border-[#ebdcb9]" />
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Material: {item.material}</div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500 uppercase text-[10px] font-semibold tracking-wide">
                    {item.roomCategory === 'living room' ? 'Living' : item.roomCategory === 'dining room' ? 'Dining' : 'Office'}
                  </td>
                  <td className="p-3 text-right font-bold text-[#3e2723] font-mono">{Number(item.unitPriceAFN).toLocaleString()} AFN</td>
                  <td className="p-3 text-center">
                    <span className={`font-mono font-bold px-2 py-0.5 ${Number(item.availableQuantity) === 0 ? 'text-red-600 bg-red-50' : 'text-green-700 bg-green-50'}`}>
                      {item.availableQuantity} units
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3 font-semibold">
                      <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
