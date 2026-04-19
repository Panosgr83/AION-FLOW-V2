import { useState } from 'react';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const { user, isDemoMode } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleProfileSave = async () => {
    if (isDemoMode) {
      setSuccess('Demo mode: Οι αλλαγές δεν αποθηκεύονται στο demo mode.');
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    if (error) setError(error.message);
    else setSuccess('Το προφίλ αποθηκεύτηκε!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (isDemoMode) {
      setSuccess('Demo mode: Η αλλαγή κωδικού δεν είναι διαθέσιμη.');
      return;
    }
    if (!newPassword) return;
    setSaving(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) setError(error.message);
    else { setSuccess('Ο κωδικός άλλαξε!'); setCurrentPassword(''); setNewPassword(''); }
    setTimeout(() => setSuccess(''), 3000);
  };

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
            {(user?.email ?? 'A')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{fullName || 'Admin'}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {isDemoMode && <span className="badge bg-amber-500/20 text-amber-400 text-xs mt-1">Demo Mode</span>}
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

        <button onClick={handleProfileSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
          Αποθήκευση
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <h4 className="font-semibold flex items-center gap-2"><Lock size={16} /> Αλλαγή Κωδικού</h4>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Νέος Κωδικός</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="Τουλάχιστον 8 χαρακτήρες" />
        </div>

        <button onClick={handlePasswordChange} disabled={saving || !newPassword} className="btn-secondary disabled:opacity-50">
          Αλλαγή Κωδικού
        </button>
      </div>
    </div>
  );
}
