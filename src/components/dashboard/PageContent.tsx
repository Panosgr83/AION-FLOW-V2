import { useEffect, useState } from 'react';
import { FileText, Hash, Sparkles, Plus, Trash2, X, ChevronUp, ChevronDown, GripVertical, Eye, EyeOff, Save, Check, Heart, Star, Award, Clock, Coffee, Leaf, Sun, Shield, ThumbsUp, Users, Truck, MapPin, Phone, Gift, Flame, Crown, Target, Zap, Gem, type LucideIcon } from 'lucide-react';
import { pageContentHelper, statsCountersHelper, featuresHelper } from '../../lib/dataHelpers';
import { StatsCounter, Feature } from '../../types/supabase';

type TabId = 'about' | 'stats' | 'features';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Star, Award, Clock, Coffee, Leaf, Sun, Shield,
  ThumbsUp, Users, Truck, MapPin, Phone, Gift, Flame,
  Sparkles, Crown, Target, Zap, Gem,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

function IconPreview({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <Sparkles size={size} />;
  return <Icon size={size} />;
}

export default function PageContentManager() {
  const [activeTab, setActiveTab] = useState<TabId>('about');

  const tabs: { id: TabId; label: string; icon: typeof FileText }[] = [
    { id: 'about', label: 'About Page', icon: FileText },
    { id: 'stats', label: 'Stats / Counters', icon: Hash },
    { id: 'features', label: 'Features / Values', icon: Sparkles },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Διαχείριση Περιεχομένου</h1>
        <p className="text-gray-400 text-sm mt-1">Επεξεργασία δυναμικού περιεχομένου σελίδων</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'about' && <AboutTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'features' && <FeaturesTab />}
    </div>
  );
}

function AboutTab() {
  const [pages, setPages] = useState<{ key: string; title: string; content: string }[]>([
    { key: 'about_story', title: '', content: '' },
    { key: 'about_mission', title: '', content: '' },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        pages.map(p => pageContentHelper.get(p.key))
      );
      setPages(prev => prev.map((p, i) => ({
        ...p,
        title: results[i]?.title ?? '',
        content: results[i]?.content ?? '',
      })));
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const page = pages.find(p => p.key === key);
      if (page) {
        await pageContentHelper.upsert(key, { title: page.title || null, content: page.content });
      }
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      alert('Σφάλμα αποθήκευσης: ' + (err instanceof Error ? err.message : 'Άγνωστο σφάλμα'));
    } finally {
      setSaving(null);
    }
  };

  const updatePage = (key: string, field: 'title' | 'content', value: string) => {
    setPages(prev => prev.map(p => p.key === key ? { ...p, [field]: value } : p));
  };

  const labels: Record<string, { title: string; desc: string }> = {
    about_story: { title: 'Η Ιστορία μας', desc: 'Το κείμενο που εμφανίζεται στη σελίδα About — ιστορία του καταστήματος' },
    about_mission: { title: 'Η Αποστολή μας', desc: 'Mission statement — φιλοσοφία και αξίες' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {pages.map(page => (
        <div key={page.key} className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">{labels[page.key]?.title ?? page.key}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{labels[page.key]?.desc}</p>
            </div>
            <button
              onClick={() => handleSave(page.key)}
              disabled={saving === page.key}
              className={`btn-primary text-sm ${saved === page.key ? '!bg-green-600' : ''}`}
            >
              {saved === page.key ? <><Check size={14} /> Αποθηκεύτηκε</> : saving === page.key ? 'Αποθήκευση...' : <><Save size={14} /> Αποθήκευση</>}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Τίτλος</label>
              <input
                type="text"
                value={page.title}
                onChange={e => updatePage(page.key, 'title', e.target.value)}
                className="input"
                placeholder="Τίτλος section..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Περιεχόμενο (HTML)</label>
              <textarea
                value={page.content}
                onChange={e => updatePage(page.key, 'content', e.target.value)}
                rows={6}
                className="input resize-none font-mono text-xs"
                placeholder="<p>Γράψτε το περιεχόμενό σας εδώ...</p>"
              />
            </div>
            {page.content && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Προεπισκόπηση</label>
                <div
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 prose prose-sm prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState<StatsCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StatsCounter | null>(null);
  const [form, setForm] = useState({ label: '', value: '', suffix: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    statsCountersHelper.getAll()
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { console.error('[StatsTab] getAll error:', err); setLoading(false); });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ label: '', value: '', suffix: '', is_active: true }); setSaveError(null); setShowModal(true); };
  const openEdit = (s: StatsCounter) => {
    setEditing(s);
    setForm({ label: s.label, value: s.value, suffix: s.suffix ?? '', is_active: s.is_active });
    setSaveError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    console.log('[StatsTab] handleSave called, editing:', !!editing);
    try {
      const payload = { label: form.label, value: form.value, suffix: form.suffix || null, is_active: form.is_active };
      console.log('[StatsTab] payload:', JSON.stringify(payload));
      if (editing) {
        const updated = await statsCountersHelper.update(editing.id, payload);
        console.log('[StatsTab] update success:', updated);
        setStats(prev => prev.map(s => s.id === editing.id ? updated : s));
      } else {
        const maxPos = stats.reduce((max, s) => Math.max(max, s.order_position), 0);
        const created = await statsCountersHelper.create({ ...payload, order_position: maxPos + 1 });
        console.log('[StatsTab] create success:', created);
        setStats(prev => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Άγνωστο σφάλμα';
      console.error('[StatsTab] save error:', err);
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await statsCountersHelper.delete(deleteId);
    setStats(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  const toggleActive = async (counter: StatsCounter) => {
    const updated = await statsCountersHelper.update(counter.id, { is_active: !counter.is_active });
    setStats(prev => prev.map(s => s.id === counter.id ? updated : s));
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const idx = stats.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === stats.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newList = [...stats];
    [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];
    const updates = newList.map((s, i) => ({ id: s.id, order_position: i + 1 }));
    setStats(newList.map((s, i) => ({ ...s, order_position: i + 1 })));
    await statsCountersHelper.updateOrder(updates);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">Αριθμητικοί δείκτες που εμφανίζονται στο website (π.χ. "38+ Χρόνια Εμπειρίας")</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Νέος Counter</button>
      </div>

      {stats.length === 0 ? (
        <div className="card p-10 text-center">
          <Hash size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">Δεν υπάρχουν counters. Προσθέστε τον πρώτο.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stats.map((counter, idx) => (
            <div key={counter.id} className={`card p-4 flex items-center gap-4 group transition-all hover:border-gray-700 ${!counter.is_active ? 'opacity-60' : ''}`}>
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveItem(counter.id, 'up')} disabled={idx === 0} className="p-0.5 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-400"><ChevronUp size={14} /></button>
                <GripVertical size={14} className="text-gray-600 mx-auto" />
                <button onClick={() => moveItem(counter.id, 'down')} disabled={idx === stats.length - 1} className="p-0.5 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-400"><ChevronDown size={14} /></button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{counter.value}</span>
                  {counter.suffix && <span className="text-lg font-bold text-blue-400">{counter.suffix}</span>}
                </div>
                <p className="text-sm text-gray-400">{counter.label}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(counter)} className={`p-2 rounded-lg transition-colors ${counter.is_active ? 'bg-green-600/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {counter.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(counter)} className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                  <FileText size={15} />
                </button>
                <button onClick={() => setDeleteId(counter.id)} className="p-2 rounded-lg bg-gray-800 text-red-400 hover:bg-red-600/20 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h2 className="text-lg font-bold">{editing ? 'Επεξεργασία Counter' : 'Νέος Counter'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Label *</label>
                <input type="text" value={form.label} onChange={e => setForm(prev => ({ ...prev, label: e.target.value }))} placeholder="π.χ. Χρόνια Εμπειρίας" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Value *</label>
                  <input type="text" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: e.target.value }))} placeholder="π.χ. 38" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Suffix</label>
                  <input type="text" value={form.suffix} onChange={e => setForm(prev => ({ ...prev, suffix: e.target.value }))} placeholder="π.χ. +" className="input" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <button type="button" onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-gray-300">{form.is_active ? 'Ενεργό' : 'Ανενεργό'}</span>
              </div>
              {form.value && (
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                  <span className="text-3xl font-bold text-white">{form.value}</span>
                  {form.suffix && <span className="text-2xl font-bold text-blue-400">{form.suffix}</span>}
                  <p className="text-sm text-gray-400 mt-1">{form.label || '...'}</p>
                </div>
              )}
            </div>
            {saveError && (
              <div className="mx-5 mb-0 p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">
                <strong>Σφάλμα:</strong> {saveError}
              </div>
            )}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-800">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Ακύρωση</button>
              <button onClick={handleSave} disabled={saving || !form.label || !form.value} className="btn-primary disabled:opacity-50">
                {saving ? 'Αποθήκευση...' : editing ? 'Ενημέρωση' : 'Δημιουργία'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Διαγραφή Counter</h3>
            <p className="text-gray-400 text-sm mb-6">Είστε σίγουροι; Η ενέργεια δεν μπορεί να αναιρεθεί.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Ακύρωση</button>
              <button onClick={handleDelete} className="btn-danger">Διαγραφή</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturesTab() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState({ icon: 'Star', title: '', description: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    featuresHelper.getAll()
      .then(data => { setFeatures(data); setLoading(false); })
      .catch(err => { console.error('[FeaturesTab] getAll error:', err); setLoading(false); });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ icon: 'Star', title: '', description: '', is_active: true }); setSaveError(null); setShowModal(true); };
  const openEdit = (f: Feature) => {
    setEditing(f);
    setForm({ icon: f.icon, title: f.title, description: f.description, is_active: f.is_active });
    setSaveError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    console.log('[FeaturesTab] handleSave called, editing:', !!editing);
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout: η αποθήκευση δεν ολοκληρώθηκε σε 15 δευτερόλεπτα')), 15000));
    try {
      const payload = { icon: form.icon, title: form.title, description: form.description, is_active: form.is_active };
      console.log('[FeaturesTab] payload:', JSON.stringify(payload));
      if (editing) {
        const updated = await Promise.race([featuresHelper.update(editing.id, payload), timeout]);
        console.log('[FeaturesTab] update success:', updated);
        setFeatures(prev => prev.map(f => f.id === editing.id ? updated : f));
      } else {
        const maxPos = features.reduce((max, f) => Math.max(max, f.order_position), 0);
        console.log('[FeaturesTab] calling create...');
        const created = await Promise.race([featuresHelper.create({ ...payload, order_position: maxPos + 1 }), timeout]);
        console.log('[FeaturesTab] create success:', created);
        setFeatures(prev => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Άγνωστο σφάλμα';
      console.error('[FeaturesTab] save error:', err);
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await featuresHelper.delete(deleteId);
    setFeatures(prev => prev.filter(f => f.id !== deleteId));
    setDeleteId(null);
  };

  const toggleActive = async (feature: Feature) => {
    const updated = await featuresHelper.update(feature.id, { is_active: !feature.is_active });
    setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const idx = features.findIndex(f => f.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === features.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newList = [...features];
    [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];
    const updates = newList.map((f, i) => ({ id: f.id, order_position: i + 1 }));
    setFeatures(newList.map((f, i) => ({ ...f, order_position: i + 1 })));
    await featuresHelper.updateOrder(updates);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">Features/Values cards — εμφανίζονται στην αρχική ή στο About</p>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Νέο Feature</button>
      </div>

      {features.length === 0 ? (
        <div className="card p-10 text-center">
          <Sparkles size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">Δεν υπάρχουν features. Προσθέστε το πρώτο.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={feature.id} className={`card p-4 group transition-all hover:border-gray-700 ${!feature.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <IconPreview name={feature.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{feature.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveItem(feature.id, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-400"><ChevronUp size={14} /></button>
                  <button onClick={() => moveItem(feature.id, 'down')} disabled={idx === features.length - 1} className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-400"><ChevronDown size={14} /></button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toggleActive(feature)} className={`p-1.5 rounded-lg transition-colors ${feature.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                    {feature.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(feature)} className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <FileText size={14} />
                  </button>
                  <button onClick={() => setDeleteId(feature.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h2 className="text-lg font-bold">{editing ? 'Επεξεργασία Feature' : 'Νέο Feature'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon</label>
                <div className="relative">
                  <button
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="input flex items-center gap-2 cursor-pointer text-left"
                  >
                    <IconPreview name={form.icon} size={18} />
                    <span className="text-gray-300">{form.icon}</span>
                  </button>
                  {showIconPicker && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl p-3 z-20 grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto">
                      {ICON_OPTIONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => { setForm(prev => ({ ...prev, icon })); setShowIconPicker(false); }}
                          className={`p-2 rounded-lg flex items-center justify-center transition-colors ${form.icon === icon ? 'bg-blue-600/30 text-blue-400' : 'hover:bg-gray-700 text-gray-400'}`}
                          title={icon}
                        >
                          <IconPreview name={icon} size={18} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Τίτλος *</label>
                <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="π.χ. Φτιαγμένα με Αγάπη" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Περιγραφή</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Σύντομη περιγραφή..." className="input resize-none" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <button type="button" onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-gray-300">{form.is_active ? 'Ενεργό' : 'Ανενεργό'}</span>
              </div>
            </div>
            {saveError && (
              <div className="mx-5 mb-0 p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">
                <strong>Σφάλμα:</strong> {saveError}
              </div>
            )}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-800">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Ακύρωση</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="btn-primary disabled:opacity-50">
                {saving ? 'Αποθήκευση...' : editing ? 'Ενημέρωση' : 'Δημιουργία'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Διαγραφή Feature</h3>
            <p className="text-gray-400 text-sm mb-6">Είστε σίγουροι; Η ενέργεια δεν μπορεί να αναιρεθεί.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Ακύρωση</button>
              <button onClick={handleDelete} className="btn-danger">Διαγραφή</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
