import { useState, useEffect } from 'react';
import { User, Mail, Lock, CheckCircle, Globe, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileHelper } from '../../lib/dataHelpers';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const { user, isDemoMode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('admin');
  const [timezone, setTimezone] = useState('Europe/Athens');
  const [locale, setLocale] = useState('el');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || isDemoMode) {
      setFullName('Demo Admin');
      setLoading(false);
      return;
    }
    profileHelper.get(user.id).then(profile => {
      if (profile) {
        setFullName((profile.full_name as string) || user.user_metadata?.full_name || '');
        setRole((profile.role as string) || 'admin');
        setTimezone((profile.timezone as string) || 'Europe/Athens');
        setLocale((profile.locale as string) || 'el');
      } else {
        setFullName(user.user_metadata?.full_name || '');
      }
      setLoading(false);
    });
  }, [user, isDemoMode]);

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleProfileSave = async () => {
    if (isDemoMode) { showSuccess('Demo mode: Οι αλλαγές δεν αποθηκεύονται.'); return; }
    if (!user) return;
    setSaving(true);
    setError('');
    await profileHelper.upsert(user.id, { email: user.email, full_name: fullName, role, timezone, locale });
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    showSuccess('Το προφίλ αποθηκεύτηκε στη βάση δεδομένων!');
  };

  const handlePasswordChange = async () => {
    if (isDemoMode) { showSuccess('Demo mode: Αλλαγή κωδικού δεν είναι διαθέσιμη.'); return; }
    if (!newPassword || newPassword.length < 6) { setError('Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (err) setError(err.message);
    else { showSuccess('Ο κωδικός άλλαξε!'); setNewPassword(''); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div>
        <h2 className="text-xl font-semibold">Προφίλ</h2>
        <p className="text-sm text-gray-500">Διαχείριση στοιχείων λογαριασμού</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <CheckCircle size={14} /> {success}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>
      )}

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {(fullName || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{fullName || 'Admin'}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge bg-blue-500/15 text-blue-400 text-xs capitalize">{role}</span>
              {isDemoMode && <span className="badge bg-amber-500/20 text-amber-400 text-xs">Demo</span>}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><User size={12} /> Πλήρες Όνομα</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} className="input" placeholder="Το όνομά σας" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><Mail size={12} /> Email</label>
          <input value={user?.email ?? ''} disabled className="input opacity-50 cursor-not-allowed" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><Clock size={12} /> Ζώνη Ώρας</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="input">
              <option value="Europe/Athens">Europe/Athens</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><Globe size={12} /> Γλώσσα</label>
            <select value={locale} onChange={e => setLocale(e.target.value)} className="input">
              <option value="el">Ελληνικά</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <button onClick={handleProfileSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
          Αποθήκευση Προφίλ
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <h4 className="font-semibold flex items-center gap-2"><Lock size={16} /> Αλλαγή Κωδικού</h4>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Νέος Κωδικός</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="Τουλάχιστον 6 χαρακτήρες" />
        </div>
        <button onClick={handlePasswordChange} disabled={saving || !newPassword} className="btn-secondary disabled:opacity-50">
          Αλλαγή Κωδικού
        </button>
      </div>
    </div>
  );
}
