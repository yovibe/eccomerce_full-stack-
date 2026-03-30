import { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';

// ─── Reusable Modal Shell ───────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>
      <div className="px-8 py-6">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-[#f5f5f5] text-gray-900 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm";

// ─── Product Modal (Add / Edit) ─────────────────────────────────────
const ProductModal = ({ categories, onClose, onSaved, existing }) => {
  const isEdit = !!existing;

  const [form, setForm] = useState({
    name:        existing?.name        || '',
    price:       existing?.price       || '',
    description: existing?.description || '',
    material:    existing?.material    || '',
    warranty:    existing?.warranty    || '',
    categoryId:  existing?.categoryId  || '',
  });

  const [images, setImages] = useState({
    front: existing?.imageUrls?.[0] || '',
    back:  existing?.imageUrls?.[1] || '',
    side:  existing?.imageUrls?.[2] || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const set    = (k) => (e) => setForm(f   => ({ ...f,  [k]: e.target.value }));
  const setImg = (k) => (e) => setImages(i => ({ ...i,  [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Name and Price are required.'); return; }
    setSaving(true); setError(null);
    const payload = {
      name:        form.name,
      price:       parseFloat(form.price),
      description: form.description,
      material:    form.material,
      warranty:    form.warranty,
      categoryId:  form.categoryId ? parseInt(form.categoryId) : undefined,
      imageUrls:   [images.front, images.back, images.side].filter(Boolean),
    };
    try {
      if (isEdit) {
        await api.put(`/products/${existing.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Save product error:', err.response || err);
      setError(err.response?.data?.message || err.response?.data?.error || `Error ${err.response?.status}: Could not save product.`);
    } finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Edit Product' : 'Add New Product'} onClose={onClose} wide>
      <div className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Name *">
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Slim Fit Jacket" />
          </Field>
          <Field label="Price (USD) *">
            <input className={inputCls} type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="129.99" />
          </Field>
        </div>

        <Field label="Description">
          <textarea className={`${inputCls} resize-none h-20`} value={form.description} onChange={set('description')} placeholder="Short product description..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Material">
            <input className={inputCls} value={form.material} onChange={set('material')} placeholder="e.g. 100% Cotton" />
          </Field>
          <Field label="Warranty">
            <input className={inputCls} value={form.warranty} onChange={set('warranty')} placeholder="e.g. 1 Year" />
          </Field>
        </div>

        <Field label="Category">
          <select className={inputCls} value={form.categoryId} onChange={set('categoryId')}>
            <option value="">— Select a category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        {/* 3 image slots with live preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
          <div className="space-y-3">
            {[
              { key: 'front', label: 'Front View', placeholder: 'https://example.com/front.jpg' },
              { key: 'back',  label: 'Back View',  placeholder: 'https://example.com/back.jpg'  },
              { key: 'side',  label: 'Side View',  placeholder: 'https://example.com/side.jpg'  },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#f0f0f0] border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {images[key]
                    ? <img src={images[key]} alt={label} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    : <span className="text-[10px] text-gray-400 font-medium text-center leading-tight px-1">{label.split(' ')[0]}</span>
                  }
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
                  <input className={inputCls} value={images[key]} onChange={setImg(key)} placeholder={placeholder} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400">
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Category Modal (Add / Edit) ────────────────────────────────────
const CategoryModal = ({ onClose, onSaved, existing }) => {
  const isEdit = !!existing;
  const [name, setName]   = useState(existing?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleSave = async () => {
    if (!name.trim()) { setError('Category name is required.'); return; }
    setSaving(true); setError(null);
    try {
      if (isEdit) {
        await api.put(`/categories/${existing.id}`, { name: name.trim() });
      } else {
        await api.post('/categories', { name: name.trim() });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Save category error:', err.response || err);
      setError(err.response?.data?.message || err.response?.data?.error || `Error ${err.response?.status}: Could not save category.`);
    } finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Edit Category' : 'Add New Category'} onClose={onClose}>
      <div className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Field label="Category Name *">
          <input
            className={inputCls}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Outerwear"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400">
            {saving ? 'Saving...' : isEdit ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Delete Confirm Modal ───────────────────────────────────────────
const ConfirmDelete = ({ label, onConfirm, onClose, loading }) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <div className="space-y-6">
      <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold text-gray-900">"{label}"</span>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:bg-red-300">
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Admin Dashboard ────────────────────────────────────────────────
const Admin = () => {
  const [activeTab,  setActiveTab]  = useState('products');
  const [items,      setItems]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [deleteErr,  setDeleteErr]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  // modal state: null | 'add' | 'edit'
  const [modal,      setModal]      = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    // Only fetch products/categories data when on those tabs
    if (activeTab === 'products' || activeTab === 'categories') fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        api.get(activeTab === 'products' ? '/products' : '/categories'),
        api.get('/categories'),
      ]);
      const normalize = (r) => Array.isArray(r.data) ? r.data : r.data.content ?? [];
      setItems(normalize(itemsRes));
      setCategories(normalize(catsRes));
    } catch (err) {
      console.error('Fetch error:', err.response || err);
    } finally { setLoading(false); }
  };

  const openEdit = (item) => { setEditTarget(item); setModal('edit'); };
  const openAdd  = ()     => { setEditTarget(null);  setModal('add');  };
  const closeModal = ()   => { setModal(null); setEditTarget(null); };

  const confirmDelete = (item) => { setDeleteErr(null); setDeleteTarget(item); };

  const handleDelete = async () => {
    setDeleting(true); setDeleteErr(null);
    try {
      const endpoint = activeTab === 'products' ? `/products/${deleteTarget.id}` : `/categories/${deleteTarget.id}`;
      await api.delete(endpoint);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err.response || err);
      setDeleteErr(err.response?.data?.message || err.response?.data?.error || `Error ${err.response?.status}: Could not delete item.`);
    } finally { setDeleting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 mb-10">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-100 pb-6 mb-8 overflow-x-auto whitespace-nowrap">
        {['products', 'categories', 'orders', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full font-medium capitalize transition-all text-sm ${activeTab === tab ? 'bg-black text-white' : 'bg-[#f4f4f4] text-gray-600 hover:bg-gray-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === 'orders' && <AdminOrders />}

      {/* Users tab */}
      {activeTab === 'users' && <AdminUsers />}

      {/* Persistent delete error */}
      {deleteErr && (
        <div className="flex items-start gap-2 mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{deleteErr}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">{activeTab}</h2>
          
          {/* Category Filter for Products Tab */}
          {activeTab === 'products' && categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#f5f5f5] text-gray-700 px-4 py-2 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add New {activeTab === 'products' ? 'Product' : 'Category'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading {activeTab}...</div>
      ) : (
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</th>
                {activeTab === 'products' && <>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Category</th>
                </>}
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'products' && filterCategory !== 'All' ? items.filter(i => i.categoryName === filterCategory) : items).map(item => (
                <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">#{item.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                  {activeTab === 'products' && <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">${item.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.categoryName || '—'}</td>
                  </>}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(activeTab === 'products' && filterCategory !== 'All' ? items.filter(i => i.categoryName === filterCategory) : items).length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {modal === 'add' && activeTab === 'products' && (
        <ProductModal categories={categories} onClose={closeModal} onSaved={fetchData} />
      )}
      {modal === 'add' && activeTab === 'categories' && (
        <CategoryModal onClose={closeModal} onSaved={fetchData} />
      )}

      {/* Edit Modal */}
      {modal === 'edit' && editTarget && activeTab === 'products' && (
        <ProductModal categories={categories} onClose={closeModal} onSaved={fetchData} existing={editTarget} />
      )}
      {modal === 'edit' && editTarget && activeTab === 'categories' && (
        <CategoryModal onClose={closeModal} onSaved={fetchData} existing={editTarget} />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          loading={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Admin;
