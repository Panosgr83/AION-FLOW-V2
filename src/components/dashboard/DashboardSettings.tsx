import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Settings, Store, Globe, Bell, Shield, CheckCircle, Loader, Building2, Clock, Share2, MapPin } from 'lucide-react';
import { settingsHelper } from '../../lib/dataHelpers';

type TabId = 'general' | 'regional' | 'notifications' | 'security' | 'business' | 'hours' | 'social' | 'maps';

interface GeneralSettings {
  shop_name: string;
  shop_email: string;
  shop_phone: string;
  shop_address: string;
  shop_currency: string;
  shop_language: string;
  shop_timezone: string;
  order_notifications: boolean;
  customer_notifications: boolean;
  low_stock_alert: boolean;
  low_stock_threshold: string;
  two_factor_auth: boolean;
  session_timeout: string;
}

interface BusinessInfo {
  business_name: string;
  address_street: string;
  address_city: string;
  address_postal: string;
  address_country: string;
  phone_primary: string;
  phone_secondary: string;
  contact_email: string;
  website_url: string;
  vat_number: string;
}

interface SocialLinks {
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  social_youtube: string;
  social_google_business: string;
}

interface MapsInfo {
  maps_embed_url: string;
  maps_latitude: string;
  maps_longitude: string;
}

const tabs: { id: TabId; label: string; icon: typeof Store }[] = [
  { id: 'general', label: 'Γενικά', icon: Store },
  { id: 'regional', label: 'Περιφερειακά', icon: Globe },
  { id: 'notifications', label: 'Ειδοποιήσεις', icon: Bell },
  { id: 'security', label: 'Ασφάλεια', icon: Shield },
  { id: 'business', label: 'Επιχείρηση', icon: Building2 },
  { id: 'hours', label: 'Ωράριο', icon: Clock },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'maps', label: 'Χάρτης', icon: MapPin },
];

const DAYS = [
  { key: 'mon', label: 'Δευτέρα' },
  { key: 'tue', label: 'Τρίτη' },
  { key: 'wed', label: 'Τετάρτη' },
  { key: 'thu', label: 'Πέμπτη' },
  { key: 'fri', label: 'Παρασκευή' },
  { key: 'sat', label: 'Σάββατο' },
  { key: 'sun', label: 'Κυριακή' },
];

interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

type OperatingHours = Record<string, DayHours>;

const defaultHours: OperatingHours = Object.fromEntries(
  DAYS.map(d => [d.key, { open: d.key !== 'sun', from: '07:00', to: '21:00' }])
);

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<GeneralSettings>({
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

  const [business, setBusiness] = useState<BusinessInfo>({
    business_name: '',
    address_street: '',
    address_city: '',
    address_postal: '',
    address_country: 'Ελλάδα',
    phone_primary: '',
    phone_secondary: '',
    contact_email: '',
    website_url: '',
    vat_number: '',
  });

  const [hours, setHours] = useState<OperatingHours>(defaultHours);
  const [hoursNote, setHoursNote] = useState('');

  const [social, setSocial] = useState<SocialLinks>({
    social_facebook: '',
    social_instagram: '',
    social_tiktok: '',
    social_youtube: '',
    social_google_business: '',
  });

  const [maps, setMaps] = useState<MapsInfo>({
    maps_embed_url: '',
    maps_latitude: '',
    maps_longitude: '',
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

      setBusiness(prev => ({
        ...prev,
        business_name: (data.business_name as string) ?? prev.business_name,
        address_street: (data.address_street as string) ?? prev.address_street,
        address_city: (data.address_city as string) ?? prev.address_city,
        address_postal: (data.address_postal as string) ?? prev.address_postal,
        address_country: (data.address_country as string) ?? prev.address_country,
        phone_primary: (data.phone_primary as string) ?? prev.phone_primary,
        phone_secondary: (data.phone_secondary as string) ?? prev.phone_secondary,
        contact_email: (data.contact_email as string) ?? prev.contact_email,
        website_url: (data.website_url as string) ?? prev.website_url,
        vat_number: (data.vat_number as string) ?? prev.vat_number,
      }));

      if (data.operating_hours) {
        const parsed = typeof data.operating_hours === 'string' ? JSON.parse(data.operating_hours) : data.operating_hours;
        if (parsed.schedule) setHours(parsed.schedule);
        if (parsed.note) setHoursNote(parsed.note);
      }

      setSocial(prev => ({
        ...prev,
        social_facebook: (data.social_facebook as string) ?? prev.social_facebook,
        social_instagram: (data.social_instagram as string) ?? prev.social_instagram,
        social_tiktok: (data.social_tiktok as string) ?? prev.social_tiktok,
        social_youtube: (data.social_youtube as string) ?? prev.social_youtube,
        social_google_business: (data.social_google_business as string) ?? prev.social_google_business,
      }));

      setMaps(prev => ({
        ...prev,
        maps_embed_url: (data.maps_embed_url as string) ?? prev.maps_embed_url,
        maps_latitude: (data.maps_latitude as string) ?? prev.maps_latitude,
        maps_longitude: (data.maps_longitude as string) ?? prev.maps_longitude,
      }));

      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);

    if (activeTab === 'general' || activeTab === 'regional' || activeTab === 'notifications' || activeTab === 'security') {
      await settingsHelper.saveMany(settings as unknown as Record<string, unknown>);
    } else if (activeTab === 'business') {
      await settingsHelper.saveMany(business as unknown as Record<string, unknown>);
    } else if (activeTab === 'hours') {
      await settingsHelper.save('operating_hours', { schedule: hours, note: hoursNote });
    } else if (activeTab === 'social') {
      await settingsHelper.saveMany(social as unknown as Record<string, unknown>);
    } else if (activeTab === 'maps') {
      await settingsHelper.saveMany(maps as unknown as Record<string, unknown>);
    }

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
        <div className="w-full md:w-48 shrink-0">
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
            {activeTab === 'general' && <GeneralTab settings={settings} setSettings={setSettings} />}
            {activeTab === 'regional' && <RegionalTab settings={settings} setSettings={setSettings} />}
            {activeTab === 'notifications' && <NotificationsTab settings={settings} setSettings={setSettings} />}
            {activeTab === 'security' && <SecurityTab settings={settings} setSettings={setSettings} />}
            {activeTab === 'business' && <BusinessTab business={business} setBusiness={setBusiness} />}
            {activeTab === 'hours' && <HoursTab hours={hours} setHours={setHours} hoursNote={hoursNote} setHoursNote={setHoursNote} />}
            {activeTab === 'social' && <SocialTab social={social} setSocial={setSocial} />}
            {activeTab === 'maps' && <MapsTab maps={maps} setMaps={setMaps} />}

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

function GeneralTab({ settings, setSettings }: { settings: GeneralSettings; setSettings: Dispatch<SetStateAction<GeneralSettings>> }) {
  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Store size={16} /> Πληροφορίες Καταστήματος</h3>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Όνομα Καταστήματος</label>
        <input value={settings.shop_name as string} onChange={e => setSettings(s => ({ ...s, shop_name: e.target.value }))} className="input" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Email Επικοινωνίας</label>
        <input value={settings.shop_email as string} onChange={e => setSettings(s => ({ ...s, shop_email: e.target.value }))} type="email" className="input" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο</label>
        <input value={settings.shop_phone as string} onChange={e => setSettings(s => ({ ...s, shop_phone: e.target.value }))} className="input" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Διεύθυνση</label>
        <input value={settings.shop_address as string} onChange={e => setSettings(s => ({ ...s, shop_address: e.target.value }))} className="input" />
      </div>
    </>
  );
}

function RegionalTab({ settings, setSettings }: { settings: GeneralSettings; setSettings: Dispatch<SetStateAction<GeneralSettings>> }) {
  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Globe size={16} /> Περιφερειακές Ρυθμίσεις</h3>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Νόμισμα</label>
        <select value={settings.shop_currency as string} onChange={e => setSettings(s => ({ ...s, shop_currency: e.target.value }))} className="input">
          <option value="EUR">EUR - Ευρώ</option>
          <option value="USD">USD - Δολάριο</option>
          <option value="GBP">GBP - Λίρα</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Γλώσσα</label>
        <select value={settings.shop_language as string} onChange={e => setSettings(s => ({ ...s, shop_language: e.target.value }))} className="input">
          <option value="el">Ελληνικά</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Ζώνη Ώρας</label>
        <select value={settings.shop_timezone as string} onChange={e => setSettings(s => ({ ...s, shop_timezone: e.target.value }))} className="input">
          <option value="Europe/Athens">Europe/Athens (UTC+2)</option>
          <option value="Europe/London">Europe/London (UTC+0)</option>
          <option value="America/New_York">America/New_York (UTC-5)</option>
        </select>
      </div>
    </>
  );
}

function NotificationsTab({ settings, setSettings }: { settings: GeneralSettings; setSettings: Dispatch<SetStateAction<GeneralSettings>> }) {
  return (
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
            <input type="checkbox" checked={settings[key as keyof GeneralSettings] as boolean} onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>
      ))}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Όριο Χαμηλού Αποθέματος</label>
        <input value={settings.low_stock_threshold as string} onChange={e => setSettings(s => ({ ...s, low_stock_threshold: e.target.value }))} type="number" className="input w-24" />
      </div>
    </>
  );
}

function SecurityTab({ settings, setSettings }: { settings: GeneralSettings; setSettings: Dispatch<SetStateAction<GeneralSettings>> }) {
  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Shield size={16} /> Ασφάλεια</h3>
      <div className="flex items-start justify-between py-2">
        <div>
          <div className="text-sm font-medium">Two-Factor Authentication</div>
          <div className="text-xs text-gray-500">Επιπλέον επίπεδο ασφάλειας για τον λογαριασμό σας</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
          <input type="checkbox" checked={settings.two_factor_auth as boolean} onChange={e => setSettings(s => ({ ...s, two_factor_auth: e.target.checked }))} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Λήξη Σύνδεσης (λεπτά)</label>
        <input value={settings.session_timeout as string} onChange={e => setSettings(s => ({ ...s, session_timeout: e.target.value }))} type="number" className="input w-24" />
      </div>
    </>
  );
}

function BusinessTab({ business, setBusiness }: { business: BusinessInfo; setBusiness: Dispatch<SetStateAction<BusinessInfo>> }) {
  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Building2 size={16} /> Στοιχεία Επιχείρησης</h3>
      <p className="text-xs text-gray-500 -mt-3">Τα στοιχεία αυτά εμφανίζονται στο footer, στη σελίδα επικοινωνίας και στα τιμολόγια.</p>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Επωνυμία Επιχείρησης</label>
        <input value={business.business_name} onChange={e => setBusiness(s => ({ ...s, business_name: e.target.value }))} className="input" placeholder="Angelus Bakery" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Οδός & Αριθμός</label>
          <input value={business.address_street} onChange={e => setBusiness(s => ({ ...s, address_street: e.target.value }))} className="input" placeholder="Λεωφ. Βουλιαγμένης 120" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Πόλη</label>
          <input value={business.address_city} onChange={e => setBusiness(s => ({ ...s, address_city: e.target.value }))} className="input" placeholder="Αθήνα" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Ταχ. Κώδικας</label>
          <input value={business.address_postal} onChange={e => setBusiness(s => ({ ...s, address_postal: e.target.value }))} className="input" placeholder="11636" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Χώρα</label>
          <input value={business.address_country} onChange={e => setBusiness(s => ({ ...s, address_country: e.target.value }))} className="input" placeholder="Ελλάδα" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο 1</label>
          <input value={business.phone_primary} onChange={e => setBusiness(s => ({ ...s, phone_primary: e.target.value }))} className="input" placeholder="+30 210 1234567" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Τηλέφωνο 2 <span className="text-gray-600">(προαιρετικό)</span></label>
          <input value={business.phone_secondary} onChange={e => setBusiness(s => ({ ...s, phone_secondary: e.target.value }))} className="input" placeholder="+30 6900000000" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email Επικοινωνίας</label>
          <input value={business.contact_email} onChange={e => setBusiness(s => ({ ...s, contact_email: e.target.value }))} type="email" className="input" placeholder="info@angelusbakery.gr" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Website <span className="text-gray-600">(προαιρετικό)</span></label>
          <input value={business.website_url} onChange={e => setBusiness(s => ({ ...s, website_url: e.target.value }))} className="input" placeholder="https://angelusbakery.gr" />
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <label className="block text-sm text-gray-400 mb-1.5">ΑΦΜ <span className="text-gray-600">(προαιρετικό)</span></label>
        <input value={business.vat_number} onChange={e => setBusiness(s => ({ ...s, vat_number: e.target.value }))} className="input" placeholder="123456789" />
      </div>
    </>
  );
}

function HoursTab({ hours, setHours, hoursNote, setHoursNote }: { hours: OperatingHours; setHours: (h: OperatingHours) => void; hoursNote: string; setHoursNote: (n: string) => void }) {
  const updateDay = (key: string, field: keyof DayHours, value: string | boolean) => {
    setHours({ ...hours, [key]: { ...hours[key], [field]: value } });
  };

  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Clock size={16} /> Ωράριο Λειτουργίας</h3>
      <p className="text-xs text-gray-500 -mt-3">Ρυθμίστε τις ώρες λειτουργίας για κάθε ημέρα. Εμφανίζονται στο website και στο Google Business.</p>

      <div className="space-y-2">
        {DAYS.map(({ key, label }) => (
          <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${hours[key]?.open ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-900/50 border-gray-800/50'}`}>
            <button
              onClick={() => updateDay(key, 'open', !hours[key]?.open)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${hours[key]?.open ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hours[key]?.open ? 'translate-x-5' : ''}`} />
            </button>

            <span className={`w-24 text-sm font-medium ${hours[key]?.open ? 'text-white' : 'text-gray-500'}`}>{label}</span>

            {hours[key]?.open ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={hours[key]?.from ?? '07:00'}
                  onChange={e => updateDay(key, 'from', e.target.value)}
                  className="input py-1.5 px-2 text-sm w-28"
                />
                <span className="text-gray-500 text-xs">έως</span>
                <input
                  type="time"
                  value={hours[key]?.to ?? '21:00'}
                  onChange={e => updateDay(key, 'to', e.target.value)}
                  className="input py-1.5 px-2 text-sm w-28"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-500 italic">Κλειστό</span>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Σημειώσεις <span className="text-gray-600">(π.χ. εξαιρέσεις, αργίες)</span></label>
        <textarea
          value={hoursNote}
          onChange={e => setHoursNote(e.target.value)}
          rows={2}
          className="input resize-none"
          placeholder="π.χ. Αργίες: Κλειστό. Παραμονές: 07:00-14:00"
        />
      </div>
    </>
  );
}

function SocialTab({ social, setSocial }: { social: SocialLinks; setSocial: Dispatch<SetStateAction<SocialLinks>> }) {
  const platforms = [
    { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/angelusbakery', color: 'text-blue-400' },
    { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/angelusbakery', color: 'text-pink-400' },
    { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@angelusbakery', color: 'text-gray-200' },
    { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/@angelusbakery', color: 'text-red-400' },
    { key: 'social_google_business', label: 'Google Business', placeholder: 'https://g.page/angelusbakery', color: 'text-green-400' },
  ];

  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><Share2 size={16} /> Social Media</h3>
      <p className="text-xs text-gray-500 -mt-3">Links που εμφανίζονται στο header/footer του website. Αφήστε κενό αν δεν υπάρχει λογαριασμός.</p>

      <div className="space-y-4">
        {platforms.map(({ key, label, placeholder, color }) => (
          <div key={key} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 ${color}`}>
              <Share2 size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <input
                value={social[key as keyof SocialLinks]}
                onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))}
                className="input"
                placeholder={placeholder}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MapsTab({ maps, setMaps }: { maps: MapsInfo; setMaps: Dispatch<SetStateAction<MapsInfo>> }) {
  return (
    <>
      <h3 className="font-semibold flex items-center gap-2"><MapPin size={16} /> Χάρτης & Τοποθεσία</h3>
      <p className="text-xs text-gray-500 -mt-3">Ενσωματώστε τον χάρτη Google Maps στη σελίδα επικοινωνίας.</p>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Google Maps Embed URL</label>
        <input
          value={maps.maps_embed_url}
          onChange={e => setMaps(s => ({ ...s, maps_embed_url: e.target.value }))}
          className="input"
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-400">Πώς να βρείτε το Embed URL:</strong><br />
            1. Ανοίξτε το Google Maps και βρείτε την τοποθεσία σας<br />
            2. Κάντε κλικ στο "Κοινοποίηση" (Share)<br />
            3. Επιλέξτε "Ενσωμάτωση χάρτη" (Embed a map)<br />
            4. Αντιγράψτε το URL από το src="..." του iframe
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Latitude</label>
          <input
            value={maps.maps_latitude}
            onChange={e => setMaps(s => ({ ...s, maps_latitude: e.target.value }))}
            className="input"
            placeholder="37.9838"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Longitude</label>
          <input
            value={maps.maps_longitude}
            onChange={e => setMaps(s => ({ ...s, maps_longitude: e.target.value }))}
            className="input"
            placeholder="23.7275"
          />
        </div>
      </div>

      {maps.maps_embed_url && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Προεπισκόπηση Χάρτη</label>
          <div className="rounded-xl overflow-hidden border border-gray-700/50 h-64">
            <iframe
              src={maps.maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          </div>
        </div>
      )}
    </>
  );
}
