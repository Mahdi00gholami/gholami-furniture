import React, { useState, useEffect } from "react";
import {
  configMessage,
  fromProductRow,
  supabase,
  supabaseReady,
  toProductRow,
} from "./supabase";

export default function ManageFurniture() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    roomCategory: "living room",
    material: "",
    image: "",
    unitPriceAFN: "",
    availableQuantity: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email === "mahdi0098mol@gmail.com")
        setSession(data.session);
      else if (data.session)
        setAuthError("This account does not have Furniture Manager access.");

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    supabase
      .from("furniture_items")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setAuthError(error.message);
        else setItems(data.map(fromProductRow));
      });
    return () => {
      active = false;
    };
  }, [session]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
    else if (data.session?.user?.email === "mahdi0098mol@gmail.com") {
      setSession(data.session);
    } else {
      await supabase.auth.signOut();
      setAuthError("This account does not have Furniture Manager access.");
    }
  };

  const saveItems = (updatedItems) => {
    setItems(updatedItems);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.material.trim()) errors.material = "Material is required.";
    if (!formData.image.trim()) errors.image = "Image online URL is required.";

    const price = Number(formData.unitPriceAFN);
    if (!formData.unitPriceAFN || isNaN(price) || price <= 0) {
      errors.unitPriceAFN = "Price must be a positive number.";
    }

    const qty = Number(formData.availableQuantity);
    if (
      formData.availableQuantity === "" ||
      isNaN(qty) ||
      qty < 0 ||
      !Number.isInteger(qty)
    ) {
      errors.availableQuantity = "Stock must be a whole number (>= 0).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // قالب‌بندی عددی داده‌ها برای همخوانی ۱۰۰٪ با شروط ناموجودی کارت کاتالوگ
    const formattedData = {
      ...formData,
      unitPriceAFN: Number(formData.unitPriceAFN),
      availableQuantity: Number(formData.availableQuantity),
    };

    if (editingId) {
      const { error } = await supabase
        .from("furniture_items")
        .update(toProductRow({ ...formattedData, id: editingId }))
        .eq("id", editingId);
      if (error) {
        setAuthError(error.message);
        return;
      }
      const updated = items.map((item) =>
        item.id === editingId ? { ...formattedData, id: editingId } : item,
      );
      saveItems(updated);
      setEditingId(null);
    } else {
      const newItem = { ...formattedData, id: crypto.randomUUID() };
      const { error } = await supabase
        .from("furniture_items")
        .insert(toProductRow(newItem));
      if (error) {
        setAuthError(error.message);
        return;
      }
      saveItems([...items, newItem]);
    }

    setFormData({
      id: "",
      title: "",
      roomCategory: "living room",
      material: "",
      image: "",
      unitPriceAFN: "",
      availableQuantity: "",
      description: "",
    });
    setFormErrors({});
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setFormErrors({});
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Delete this furniture from workshop catalog?")) {
      const { error } = await supabase
        .from("furniture_items")
        .delete()
        .eq("id", id);
      if (error) {
        setAuthError(error.message);
        return;
      }
      const filtered = items.filter((item) => item.id !== id);
      saveItems(filtered);
    }
  };

  if (!supabaseReady)
    return (
      <div className="max-w-xl mx-auto p-6 text-red-700">{configMessage()}</div>
    );
  if (loading)
    return <div className="max-w-xl mx-auto p-6 text-gray-600">Loading…</div>;
  if (!session)
    return (
      <div className="max-w-md mx-auto p-6 font-sans text-left" dir="ltr">
        <div className="bg-white p-6 border border-[#ebdcb9]">
          <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-4">
            Furniture Manager Login
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-3 text-xs">
            <label className="font-semibold text-gray-700">
              Email
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-[#ebdcb9] bg-[#fbf9f4] p-2"
              />
            </label>
            <label className="font-semibold text-gray-700">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-[#ebdcb9] bg-[#fbf9f4] p-2"
              />
            </label>
            {authError && <p className="text-red-600">{authError}</p>}
            <button className="bg-[#3e2723] hover:bg-black text-white font-bold py-2 uppercase tracking-wider">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-left" dir="ltr">
      {/* تیتر صفحه مدیریت با لبه خط پهلو قهوه‌ای تیره */}
      <div className="mb-8 border-l-4 border-[#3e2723] pl-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
          Workshop Inventory Management
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Create, edit, or delete furniture records and update live stock levels
        </p>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setSession(null);
          }}
          className="mt-2 text-xs text-red-600 hover:text-red-800"
        >
          Sign Out
        </button>
      </div>
      {authError && <p className="mb-4 text-xs text-red-600">{authError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* فرم ثبت و ویرایش اطلاعات کالا */}
        <div className="bg-white p-5 rounded-none border border-[#ebdcb9] h-fit">
          <h3 className="font-bold text-[#3e2723] mb-4 border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">
            {editingId ? "Edit Furniture Record" : "Add New Furniture"}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Furniture Title:
              </label>
              <input
                type="text"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {formErrors.title && (
                <span className="text-[10px] text-red-600 font-medium">
                  {formErrors.title}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Room Category:
              </label>
              <select
                className="border border-[#ebdcb9] bg-white p-2 focus:outline-none focus:border-[#3e2723]"
                value={formData.roomCategory}
                onChange={(e) =>
                  setFormData({ ...formData, roomCategory: e.target.value })
                }
              >
                <option value="living room">Living Room</option>
                <option value="dining room">Dining Room</option>
                <option value="office">Office Space</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Material Type:
              </label>
              <input
                type="text"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
              />
              {formErrors.material && (
                <span className="text-[10px] text-red-600 font-medium">
                  {formErrors.material}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Online Image URL (Local or Remote):
              </label>
              <input
                type="text"
                placeholder="/chair 1.png or URL"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              {formErrors.image && (
                <span className="text-[10px] text-red-600 font-medium">
                  {formErrors.image}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Unit Price (AFN):
              </label>
              <input
                type="number"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 text-left focus:outline-none focus:border-[#3e2723]"
                value={formData.unitPriceAFN}
                onChange={(e) =>
                  setFormData({ ...formData, unitPriceAFN: e.target.value })
                }
              />
              {formErrors.unitPriceAFN && (
                <span className="text-[10px] text-red-600 font-medium">
                  {formErrors.unitPriceAFN}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Available Workshop Quantity:
              </label>
              <input
                type="number"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 text-left focus:outline-none focus:border-[#3e2723]"
                value={formData.availableQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableQuantity: e.target.value,
                  })
                }
              />
              {formErrors.availableQuantity && (
                <span className="text-[10px] text-red-600 font-medium">
                  {formErrors.availableQuantity}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">
                Description:
              </label>
              <textarea
                rows="2"
                className="border border-[#ebdcb9] bg-[#fbf9f4] p-2 focus:outline-none focus:border-[#3e2723]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-grow bg-[#3e2723] hover:bg-black text-white font-bold py-2 rounded-none transition-colors uppercase tracking-wider text-[11px]"
              >
                {editingId ? "Update Record" : "Save Item"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      id: "",
                      title: "",
                      roomCategory: "living room",
                      material: "",
                      image: "",
                      unitPriceAFN: "",
                      availableQuantity: "",
                      description: "",
                    });
                    setFormErrors({});
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-none font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* جدول ادمین برای نمایش، حذف و تغییرات مبل‌ها */}
        <div className="lg:col-span-2 bg-white p-5 rounded-none border border-[#ebdcb9] overflow-x-auto shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-[#f3eee1] pb-2 text-xs uppercase tracking-wider">
            Active Inventory Database
          </h3>
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
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-none bg-white border border-[#ebdcb9]"
                    />
                    <div>
                      <div className="font-bold text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Material: {item.material}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500 uppercase text-[10px] font-semibold tracking-wide">
                    {item.roomCategory === "living room"
                      ? "Living"
                      : item.roomCategory === "dining room"
                        ? "Dining"
                        : "Office"}
                  </td>
                  <td className="p-3 text-right font-bold text-[#3e2723] font-mono">
                    {Number(item.unitPriceAFN).toLocaleString()} AFN
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 ${Number(item.availableQuantity) === 0 ? "text-red-600 bg-red-50" : "text-green-700 bg-green-50"}`}
                    >
                      {item.availableQuantity} units
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3 font-semibold">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
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
