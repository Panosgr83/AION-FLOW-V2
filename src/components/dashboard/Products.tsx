import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, X, Package, Star } from 'lucide-react';
import { productsHelper, categoriesHelper } from '../../lib/dataHelpers';
import { Product, Category } from '../../types/supabase';

const emptyForm = { name: '', slug: '', description: '', price: '', compare_price: '', sku: '', stock_quantity: '', category_id: '', image_url: '', is_active: true, is_featured: false, track_inventory: true };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([productsHelper.getAll(), categoriesHelper.getAll()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, description: p.description, price: p.price.toString(),
      compare_price: p.compare_price?.toString() ?? '', sku: p.sku,
      stock_quantity: p.stock_quantity.toString(), category_id: p.category_id ?? '',
      image_url: p.image_url, is_active: p.is_active, is_featured: p.is_featured,
      track_inventory: p.track_inventory,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description, price: parseFloat(form.price) || 0,
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      sku: form.sku, stock_quantity: parseInt(form.stock_quantity) || 0,
      track_inventory: form.track_inventory,
      category_id: form.category_id || null, image_url: form.image_url,
      is_active: form.is_active, is_featured: form.is_featured,
    };
    if (editing) {
      const updated = await productsHelper.update(editing.id, payload);
      setProducts(prev => prev.map(p => p.id === editing.id ? updated : p));
    } else {
      const created = await productsHelper.create(payload);
      setProducts(prev => [created, ...prev]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await productsHelper.delete(deleteId);
    setProducts(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  const formatter = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Προϊόντα</h2>
          <p className="text-sm text-gray-500">{products.length} συνολικά προϊόντα</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Νέο Προϊόν
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Αναζήτηση προϊόντος..."
            className="input pl-9"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Προϊόν</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Κατηγορία</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Τιμή</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Απόθεμα</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Package size={16} className="text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm">{product.name}</span>
                          {product.is_featured && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-400">{(product.categories as Category)?.name ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{formatter.format(product.price)}</div>
                    {product.compare_price && (
                      <div className="text-xs text-gray-600 line-through">{formatter.format(product.compare_price)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-sm font-medium ${product.stock_quantity <= 5 ? 'text-red-400' : product.stock_quantity <= 20 ? 'text-amber-400' : 'text-green-400'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${product.is_active ? 'bg-green-500/15 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                      {product.is_active ? 'Ενεργό' : 'Ανενεργό'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">Δεν βρέθηκαν προϊόντα</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? 'Επεξεργασία' : 'Νέο'} Προϊόν</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Όνομα</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="Όνομα προϊόντος" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Τιμή (€)</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} type="number" step="0.01" className="input" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Τιμή Σύγκρισης (€)</label>
                  <input value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} type="number" step="0.01" className="input" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="input" placeholder="SKU-001" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Απόθεμα</label>
                  <input value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} type="number" className="input" placeholder="0" disabled={!form.track_inventory} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" checked={form.track_inventory} onChange={e => setForm(f => ({ ...f, track_inventory: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-gray-300">Παρακολούθηση Αποθέματος</span>
                <span className="text-xs text-gray-500 ml-1">(Track Inventory)</span>
              </label>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Κατηγορία</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input">
                  <option value="">— Χωρίς κατηγορία —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">URL Εικόνας</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Περιγραφή</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input resize-none" placeholder="Περιγραφή προϊόντος..." />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-300">Ενεργό</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-300">Επιλεγμένο</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Ακύρωση</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Διαγραφή Προϊόντος</h3>
            <p className="text-gray-400 text-sm mb-6">Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν; Η ενέργεια δεν μπορεί να αναιρεθεί.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Ακύρωση</button>
              <button onClick={handleDelete} className="btn-danger flex-1 justify-center">Διαγραφή</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
