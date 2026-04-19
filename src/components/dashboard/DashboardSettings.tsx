import { useState } from 'react';
import { Settings, Store, Globe, Bell, Shield, CheckCircle } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'Γενικά', icon: Store },
  { id: 'regional', label: 'Περιφερειακά', icon: Globe },
  { id: 'notifications', label: 'Ειδοποιήσεις', icon: Bell },
  { id: 'security', label: 'Ασφάλεια', icon: Shield },
];

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    shopName: 'AION FLOW',
    shopEmail: 'info@aionflow.gr',
    shopPhone: '+30 210 0000000',
    shopAddress: 'Αθήνα, Ελλάδα',
    currency: 'EUR',
    language: 'el',
    timezone: 'Europe/Athens',
    orderNotifications: true,
    customerNotifications: true,
    lowStockAlert: true,
    lowStockThreshold: '5',
    twoFactorAuth: false,
    sessionTimeout: '30',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold">Ρυθμίσεις</h2>
        <p className="text-sm text-gray-500">Διαμόρφωση καταστήματος και λογαριασμού</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <CheckCircle size={14} /> Οι ρυθμίσεις αποθηκεύτηκαν!
        </div>
      )}

      <div className="flex gap-5">
        <div className="w-44 shrink-0">
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
                  <input value={settings.shopName} onChange={e => setSettings(s => ({ ...s, shopName: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Επικοινωνίας</label>
                  <input value={settings.shopEmail} onChange={e => setSettings(s => ({ ...s, shopEmail: e.target.value }))} type="email" className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο</label>
                  <input value={settings.shopPhone} onChange={e => setSettings(s => ({ ...s, shopPhone: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Διεύθυνση</label>
                  <input value={settings.shopAddress} onChange={e => setSettings(s => ({ ...s, shopAddress: e.target.value }))} className="input" />
                </div>
              </>
            )}

            {activeTab === 'regional' && (
              <>
                <h3 className="font-semibold flex items-center gap-2"><Globe size={16} /> Περιφερειακές Ρυθμίσεις</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Νόμισμα</label>
                  <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="input">
                    <option value="EUR">EUR — Ευρώ (€)</option>
                    <option value="USD">USD — Δολάριο ($)</option>
                    <option value="GBP">GBP — Λίρα (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Γλώσσα</label>
                  <select value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))} className="input">
                    <option value="el">Ελληνικά</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Ζώνη Ώρας</label>
                  <select value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))} className="input">
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
                  { key: 'orderNotifications', label: 'Ειδοποιήσεις νέων παραγγελιών', desc: 'Λαμβάνετε email για κάθε νέα παραγγελία' },
                  { key: 'customerNotifications', label: 'Ειδοποιήσεις νέων πελατών', desc: 'Λαμβάνετε email για νέες εγγραφές' },
                  { key: 'lowStockAlert', label: 'Ειδοποίηση χαμηλού αποθέματος', desc: 'Ειδοποίηση όταν το απόθεμα πέσει κάτω από το όριο' },
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
                  <input value={settings.lowStockThreshold} onChange={e => setSettings(s => ({ ...s, lowStockThreshold: e.target.value }))} type="number" className="input w-24" />
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
                    <input type="checkbox" checked={settings.twoFactorAuth} onChange={e => setSettings(s => ({ ...s, twoFactorAuth: e.target.checked }))} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Λήξη Σύνδεσης (λεπτά)</label>
                  <input value={settings.sessionTimeout} onChange={e => setSettings(s => ({ ...s, sessionTimeout: e.target.value }))} type="number" className="input w-24" />
                </div>
              </>
            )}

            <div className="pt-2">
              <button onClick={handleSave} className="btn-primary">
                <Settings size={14} /> Αποθήκευση Ρυθμίσεων
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
