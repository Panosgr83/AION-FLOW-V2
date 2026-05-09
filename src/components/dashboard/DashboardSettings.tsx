import { useState, useEffect } from 'react';
import { Settings, Store, Globe, Bell, Shield, CheckCircle, Loader } from 'lucide-react';
import { settingsHelper } from '../../lib/dataHelpers';

const tabs = [
  { id: 'general', label: 'Γενικά', icon: Store },
  { id: 'regional', label: 'Περιφερειακά', icon: Globe },
  { id: 'notifications', label: 'Ειδοποιήσεις', icon: Bell },
  { id: 'security', label: 'Ασφάλεια', icon: Shield },
];

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    shop_name: 'AION FLOW',
    shop_email: 'info@aionflow.gr',
    shop_phone: '+30 210 0000000',
    shop_address: 'Αθήνα, Ελλάδα',
    shop_currency: 'EUR',
    shop_language: 'el',
    shop_timezone: 'Europe/Athens',
    order_notifications: true,
    customer_notifications: true,
    low_stock_alert: true,
    low_stock_threshold: '5',
    two_factor_auth: false,
    session_timeout: '30',
  });

  useEffect(() => {
    settingsHelper.getAll().then(data => {
      setSettings(prev => ({
        ...prev,
        shop_name: (data.shop_name as string) ?? prev.shop_name,
        shop_email: (data.shop_email as string) ?? prev.shop_email,
        shop_phone: (data.shop_phone as string) ?? prev.shop_phone,
        shop_address: (data.shop_address as string) ?? prev.shop_address,
        shop_currency: (data.shop_currency as string) ?? prev.shop_currency,
        shop_language: (data.shop_language as string) ?? prev.shop_language,
        shop_timezone: (data.shop_timezone as string) ?? prev.shop_timezone,
        order_notifications: (data.order_notifications as boolean) ?? prev.order_notifications,
        customer_notifications: (data.customer_notifications as boolean) ?? prev.customer_notifications,
        low_stock_alert: (data.low_stock_alert as boolean) ?? prev.low_stock_alert,
        low_stock_threshold: (data.low_stock_threshold as string) ?? prev.low_stock_threshold,
        two_factor_auth: (data.two_factor_auth as boolean) ?? prev.two_factor_auth,
        session_timeout: (data.session_timeout as string) ?? prev.session_timeout,
      }));
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await settingsHelper.saveMany(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold">Ρυθμίσεις</h2>
        <p className="text-sm text-gray-500">Διαμόρφωση καταστήματος και λογαριασμού</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <CheckCircle size={14} /> Οι ρυθμίσεις αποθηκεύτηκαν στη βάση δεδομένων!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-44 shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="card p-6 space-y-5">
            {activeTab === 'general' && (
              <>
                <h3 className="font-semibold flex items-center gap-2"><Store size={16} /> Πληροφορίες Καταστήματος</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Όνομα Καταστήματος</label>
                  <input value={settings.shop_name} onChange={e => setSettings(s => ({ ...s, shop_name: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Επικοινωνίας</label>
                  <input value={settings.shop_email} onChange={e => setSettings(s => ({ ...s, shop_email: e.target.value }))} type="email" className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο</label>
                  <input value={settings.shop_phone} onChange={e => setSettings(s => ({ ...s, shop_phone: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Διεύθυνση</label>
                  <input value={settings.shop_address} onChange={e => setSettings(s => ({ ...s, shop_address: e.target.value }))} className="input" />
                </div>
              </>
            )}

            {activeTab === 'regional' && (
              <>
                <h3 className="font-semibold flex items-center gap-2"><Globe size={16} /> Περιφερειακές Ρυθμίσεις</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Νόμισμα</label>
                  <select value={settings.shop_currency} onChange={e => setSettings(s => ({ ...s, shop_currency: e.target.value }))} className="input">
                    <option value="EUR">EUR - Ευρώ</option>
                    <option value="USD">USD - Δολάριο</option>
                    <option value="GBP">GBP - Λίρα</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Γλώσσα</label>
                  <select value={settings.shop_language} onChange={e => setSettings(s => ({ ...s, shop_language: e.target.value }))} className="input">
                    <option value="el">Ελληνικά</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Ζώνη Ώρας</label>
                  <select value={settings.shop_timezone} onChange={e => setSettings(s => ({ ...s, shop_timezone: e.target.value }))} className="input">
                    <option value="Europe/Athens">Europe/Athens (UTC+2)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h3 className="font-semibold flex items-center gap-2"><Bell size={16} /> Ειδοποιήσεις</h3>
                {[
                  { key: 'order_notifications', label: 'Ειδοποιήσεις νέων παραγγελιών', desc: 'Λαμβάνετε email για κάθε νέα παραγγελία' },
                  { key: 'customer_notifications', label: 'Ειδοποιήσεις νέων πελατών', desc: 'Λαμβάνετε email για νέες εγγραφές' },
                  { key: 'low_stock_alert', label: 'Ειδοποίηση χαμηλού αποθέματος', desc: 'Ειδοποίηση όταν το απόθεμα πέσει κάτω από το όριο' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between py-2 border-b border-gray-800/50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={settings[key as keyof typeof settings] as boolean}
                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Όριο Χαμηλού Αποθέματος</label>
                  <input value={settings.low_stock_threshold} onChange={e => setSettings(s => ({ ...s, low_stock_threshold: e.target.value }))} type="number" className="input w-24" />
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h3 className="font-semibold flex items-center gap-2"><Shield size={16} /> Ασφάλεια</h3>
                <div className="flex items-start justify-between py-2">
                  <div>
                    <div className="text-sm font-medium">Two-Factor Authentication</div>
                    <div className="text-xs text-gray-500">Επιπλέον επίπεδο ασφάλειας για τον λογαριασμό σας</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input type="checkbox" checked={settings.two_factor_auth} onChange={e => setSettings(s => ({ ...s, two_factor_auth: e.target.checked }))} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Λήξη Σύνδεσης (λεπτά)</label>
                  <input value={settings.session_timeout} onChange={e => setSettings(s => ({ ...s, session_timeout: e.target.value }))} type="number" className="input w-24" />
                </div>
              </>
            )}

            <div className="pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? <Loader size={14} className="animate-spin" /> : <Settings size={14} />}
                {saving ? 'Αποθήκευση...' : 'Αποθήκευση Ρυθμίσεων'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
