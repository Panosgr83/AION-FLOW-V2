import { useEffect, useState } from 'react';
import { Search, Trash2, X, Plus, Mail, Phone, Award, UserPlus } from 'lucide-react';
import { customersHelper } from '../../lib/dataHelpers';
import { Customer, MembershipLevel } from '../../types/supabase';

const MEMBERSHIP_COLORS: Record<string, string> = {
  bronze: 'bg-amber-700/30 text-amber-600',
  silver: 'bg-gray-500/20 text-gray-400',
  gold: 'bg-amber-500/20 text-amber-400',
  platinum: 'bg-blue-500/20 text-blue-400',
};

const MEMBERSHIP_LABELS: Record<string, string> = {
  bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
};

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '',
  membership_level: 'bronze' as MembershipLevel,
  loyalty_points: '0', notes: '', is_active: true, accepts_marketing: false,
  street: '', city: '', postal_code: '', country: 'GR',
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customersHelper.getAll().then(c => { setCustomers(c); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      first_name: c.first_name, last_name: c.last_name, email: c.email, phone: c.phone,
      membership_level: c.membership_level, loyalty_points: c.loyalty_points.toString(),
      notes: c.notes, is_active: c.is_active, accepts_marketing: c.accepts_marketing,
      street: (c.shipping_address as Record<string, string>)?.street ?? '',
      city: (c.shipping_address as Record<string, string>)?.city ?? '',
      postal_code: (c.shipping_address as Record<string, string>)?.postal_code ?? '',
      country: (c.shipping_address as Record<string, string>)?.country ?? 'GR',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Partial<Customer> = {
      first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone,
      membership_level: form.membership_level, loyalty_points: parseInt(form.loyalty_points) || 0,
      notes: form.notes, is_active: form.is_active, accepts_marketing: form.accepts_marketing,
      shipping_address: { street: form.street, city: form.city, postal_code: form.postal_code, country: form.country },
    };
    if (editing) {
      const updated = await customersHelper.update(editing.id, payload);
      setCustomers(prev => prev.map(c => c.id === editing.id ? updated : c));
    } else {
      const created = await customersHelper.create(payload);
      setCustomers(prev => [created, ...prev]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await customersHelper.delete(deleteId);
    setCustomers(prev => prev.filter(c => c.id !== deleteId));
    if (selected?.id === deleteId) setSelected(null);
    setDeleteId(null);
  };

  const formatter = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Πελάτες</h2>
          <p className="text-sm text-gray-500">{customers.length} συνολικά πελάτες</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <UserPlus size={16} /> Νέος Πελάτης
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['platinum', 'gold', 'silver', 'bronze'].map(level => {
          const count = customers.filter(c => c.membership_level === level).length;
          return (
            <div key={level} className="card p-4 text-center">
              <div className={`badge mx-auto mb-2 ${MEMBERSHIP_COLORS[level]}`}>{MEMBERSHIP_LABELS[level]}</div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-gray-500">πελάτες</div>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Αναζήτηση πελάτη..." className="input pl-9" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Πελάτης</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Membership</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Παραγγελίες</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Σύνολο Αγορών</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Κατάσταση</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                        {customer.first_name[0]}{customer.last_name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{customer.first_name} {customer.last_name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Award size={12} className="text-amber-400" />
                      <span className={`badge text-xs ${MEMBERSHIP_COLORS[customer.membership_level]}`}>{MEMBERSHIP_LABELS[customer.membership_level]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm font-medium">{customer.total_orders}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">{formatter.format(customer.total_spent)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`badge text-xs ${customer.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {customer.is_active ? 'Ενεργός' : 'Ανενεργός'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setSelected(customer)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Προφίλ</button>
                      <button onClick={() => openEdit(customer)} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Edit</button>
                      <button onClick={() => setDeleteId(customer.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Δεν βρέθηκαν πελάτες</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? 'Επεξεργασία' : 'Νέος'} Πελάτης</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Όνομα</label>
                  <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="input" placeholder="Όνομα" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Επώνυμο</label>
                  <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="input" placeholder="Επώνυμο" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="input" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+30 6XX XXXX XXX" />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Διεύθυνση Αποστολής</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Οδός</label>
                    <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} className="input" placeholder="Οδός & αριθμός" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Πόλη</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input" placeholder="Πόλη" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Τ.Κ.</label>
                      <input value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} className="input" placeholder="11111" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Membership</label>
                    <select value={form.membership_level} onChange={e => setForm(f => ({ ...f, membership_level: e.target.value as MembershipLevel }))} className="input">
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Πόντοι Loyalty</label>
                    <input value={form.loyalty_points} onChange={e => setForm(f => ({ ...f, loyalty_points: e.target.value }))} type="number" className="input" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Σημειώσεις</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="input resize-none" placeholder="Σημειώσεις πελάτη..." />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-300">Ενεργός</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.accepts_marketing} onChange={e => setForm(f => ({ ...f, accepts_marketing: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-300">Marketing Emails</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Ακύρωση</button>
                <button onClick={handleSave} disabled={saving || !form.email || !form.first_name} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selected && !showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Προφίλ Πελάτη</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-300 transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400">
                  {selected.first_name[0]}{selected.last_name[0]}
                </div>
                <div>
                  <div className="text-lg font-semibold">{selected.first_name} {selected.last_name}</div>
                  <span className={`badge text-xs ${MEMBERSHIP_COLORS[selected.membership_level]}`}>{MEMBERSHIP_LABELS[selected.membership_level]}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400 shrink-0" /><span className="text-xs truncate">{selected.email}</span></div>
                </div>
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Τηλέφωνο</div>
                  <div className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400 shrink-0" /><span className="text-xs">{selected.phone || '—'}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-3 text-center">
                  <div className="text-xl font-bold">{selected.total_orders}</div>
                  <div className="text-xs text-gray-500">Παραγγελίες</div>
                </div>
                <div className="card p-3 text-center">
                  <div className="text-lg font-bold">{formatter.format(selected.total_spent)}</div>
                  <div className="text-xs text-gray-500">Σύνολο</div>
                </div>
                <div className="card p-3 text-center">
                  <div className="text-xl font-bold">{selected.loyalty_points}</div>
                  <div className="text-xs text-gray-500">Πόντοι</div>
                </div>
              </div>
              {selected.notes && (
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Σημειώσεις</div>
                  <div className="text-sm text-gray-300">{selected.notes}</div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setSelected(null); openEdit(selected); }} className="btn-secondary flex-1 justify-center">Επεξεργασία</button>
                <button onClick={() => setSelected(null)} className="btn-primary flex-1 justify-center">Κλείσιμο</button>
              </div>
              <div className="text-xs text-gray-600">Μέλος από: {new Date(selected.created_at).toLocaleDateString('el-GR')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Διαγραφή Πελάτη</h3>
            <p className="text-gray-400 text-sm mb-6">Είστε σίγουροι; Η ενέργεια δεν μπορεί να αναιρεθεί.</p>
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
