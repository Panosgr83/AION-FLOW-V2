import { useEffect, useState } from 'react';
import { Search, ChevronDown, X, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { ordersHelper, customersHelper, productsHelper } from '../../lib/dataHelpers';
import { Order, OrderStatus, Customer, Product } from '../../types/supabase';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  shipped: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Εκκρεμεί', confirmed: 'Επιβεβαιωμένη', processing: 'Επεξεργασία',
  shipped: 'Εστάλη', delivered: 'Παραδόθηκε', cancelled: 'Ακυρώθηκε', refunded: 'Επιστράφηκε',
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: 'Εκκρεμεί', paid: 'Πληρώθηκε', failed: 'Απέτυχε', refunded: 'Επιστράφηκε', partially_refunded: 'Μερ. Επιστροφή',
};

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

interface OrderLine {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [createForm, setCreateForm] = useState({ customer_id: '', payment_method: 'credit_card', notes: '' });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    ordersHelper.getAll().then(o => { setOrders(o); setLoading(false); });
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customers?.first_name} ${o.customers?.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const updated = await ordersHelper.update(orderId, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdatingId(null);
  };

  const openCreateOrder = async () => {
    const [custs, prods] = await Promise.all([customersHelper.getAll(), productsHelper.getAll()]);
    setCustomers(custs);
    setProducts(prods);
    setCreateForm({ customer_id: '', payment_method: 'credit_card', notes: '' });
    setOrderLines([]);
    setShowCreate(true);
  };

  const addLine = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = orderLines.find(l => l.product_id === productId);
    if (existing) {
      setOrderLines(prev => prev.map(l => l.product_id === productId ? { ...l, quantity: l.quantity + 1, total_price: (l.quantity + 1) * l.unit_price } : l));
    } else {
      setOrderLines(prev => [...prev, { product_id: product.id, product_name: product.name, product_sku: product.sku, quantity: 1, unit_price: product.price, total_price: product.price, image_url: product.image_url }]);
    }
  };

  const updateLineQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setOrderLines(prev => prev.filter(l => l.product_id !== productId));
    } else {
      setOrderLines(prev => prev.map(l => l.product_id === productId ? { ...l, quantity: qty, total_price: qty * l.unit_price } : l));
    }
  };

  const removeLine = (productId: string) => {
    setOrderLines(prev => prev.filter(l => l.product_id !== productId));
  };

  const subtotal = orderLines.reduce((s, l) => s + l.total_price, 0);
  const taxAmount = subtotal * 0.24;
  const total = subtotal + taxAmount;

  const handleCreate = async () => {
    if (!createForm.customer_id || orderLines.length === 0) return;
    setCreating(true);
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const order: Partial<Order> = {
      order_number: orderNumber,
      customer_id: createForm.customer_id,
      status: 'pending',
      payment_status: 'pending',
      payment_method: createForm.payment_method,
      subtotal, discount_amount: 0, shipping_cost: 0, tax_amount: taxAmount, total,
      currency: 'EUR', notes: createForm.notes,
    };
    const created = await ordersHelper.create(order, orderLines);
    setOrders(prev => [created, ...prev]);
    setCreating(false);
    setShowCreate(false);
  };

  const formatter = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Παραγγελίες</h2>
          <p className="text-sm text-gray-500">{orders.length} συνολικά παραγγελίες</p>
        </div>
        <button onClick={openCreateOrder} className="btn-primary">
          <Plus size={16} /> Νέα Παραγγελία
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Αναζήτηση παραγγελίας..." className="input pl-9" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input w-full sm:w-48">
          <option value="">Όλες οι καταστάσεις</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Αρ. Παραγγελίας</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Πελάτης</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Σύνολο</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Πληρωμή</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ημερομηνία</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={14} className="text-gray-600" />
                      <span className="font-medium text-sm">{order.order_number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-sm">{order.customers?.first_name} {order.customers?.last_name}</div>
                    <div className="text-xs text-gray-500">{order.customers?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">{formatter.format(order.total)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className={`badge border text-xs cursor-pointer appearance-none pr-5 ${STATUS_COLORS[order.status]} disabled:opacity-50`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`badge text-xs ${order.payment_status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                      {PAYMENT_LABELS[order.payment_status] ?? order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('el-GR')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Λεπτομέρειες</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Δεν βρέθηκαν παραγγελίες</div>}
        </div>
      </div>

      {/* Order Details Modal */}
      {selected && !showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{selected.order_number}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-300 transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Πελάτης</div>
                  <div className="text-sm font-medium">{selected.customers?.first_name} {selected.customers?.last_name}</div>
                  <div className="text-xs text-gray-500">{selected.customers?.email}</div>
                </div>
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Πληρωμή</div>
                  <div className="text-sm font-medium">{formatter.format(selected.total)}</div>
                  <div className="text-xs text-gray-500">{selected.payment_method}</div>
                </div>
              </div>
              <div className="card p-3">
                <div className="text-xs text-gray-500 mb-2">Κατάσταση</div>
                <span className={`badge border text-sm ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
              </div>
              {selected.tracking_number && (
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Αριθμός Παρακολούθησης</div>
                  <div className="text-sm font-mono">{selected.tracking_number}</div>
                </div>
              )}
              {selected.notes && (
                <div className="card p-3">
                  <div className="text-xs text-gray-500 mb-1">Σημειώσεις</div>
                  <div className="text-sm text-gray-300">{selected.notes}</div>
                </div>
              )}
              <div className="text-xs text-gray-600">Δημιουργήθηκε: {new Date(selected.created_at).toLocaleString('el-GR')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Νέα Παραγγελία</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-300 transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Πελάτης</label>
                <select value={createForm.customer_id} onChange={e => setCreateForm(f => ({ ...f, customer_id: e.target.value }))} className="input">
                  <option value="">— Επιλέξτε πελάτη —</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.email})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Προσθήκη Προϊόντος</label>
                <select onChange={e => { if (e.target.value) { addLine(e.target.value); e.target.value = ''; } }} className="input">
                  <option value="">— Επιλέξτε προϊόν —</option>
                  {products.filter(p => p.is_active).map(p => <option key={p.id} value={p.id}>{p.name} — {formatter.format(p.price)}</option>)}
                </select>
              </div>

              {orderLines.length > 0 && (
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Προϊόν</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-500 font-medium w-24">Ποσότητα</th>
                        <th className="text-right px-3 py-2 text-xs text-gray-500 font-medium w-28">Σύνολο</th>
                        <th className="px-2 py-2 w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {orderLines.map(line => (
                        <tr key={line.product_id}>
                          <td className="px-3 py-2">
                            <div className="text-sm font-medium">{line.product_name}</div>
                            <div className="text-xs text-gray-500">{formatter.format(line.unit_price)} / τμχ</div>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number" min="1" value={line.quantity}
                              onChange={e => updateLineQty(line.product_id, parseInt(e.target.value) || 0)}
                              className="input text-center py-1.5 w-20 mx-auto"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-medium">{formatter.format(line.total_price)}</td>
                          <td className="px-2 py-2">
                            <button onClick={() => removeLine(line.product_id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 border-t border-gray-800 space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Υποσύνολο</span><span>{formatter.format(subtotal)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">ΦΠΑ (24%)</span><span>{formatter.format(taxAmount)}</span></div>
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-800"><span>Σύνολο</span><span className="text-blue-400">{formatter.format(total)}</span></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Μέθοδος Πληρωμής</label>
                  <select value={createForm.payment_method} onChange={e => setCreateForm(f => ({ ...f, payment_method: e.target.value }))} className="input">
                    <option value="credit_card">Πιστωτική Κάρτα</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Τραπεζική Μεταφορά</option>
                    <option value="cash_on_delivery">Αντικαταβολή</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Σημειώσεις</label>
                  <input value={createForm.notes} onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))} className="input" placeholder="Προαιρετικές σημειώσεις" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center">Ακύρωση</button>
                <button onClick={handleCreate} disabled={creating || !createForm.customer_id || orderLines.length === 0} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {creating ? 'Δημιουργία...' : 'Δημιουργία Παραγγελίας'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
