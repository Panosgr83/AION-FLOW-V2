import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, X, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, Image, Link as LinkIcon, Type } from 'lucide-react';
import { slidesHelper } from '../../lib/dataHelpers';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';
import { Slide } from '../../types/supabase';

const emptyForm = {
  title: '', subtitle: '', description: '', image_url: '',
  cta1_text: '', cta1_link: '', cta2_text: '', cta2_link: '',
  is_active: true,
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    slidesHelper.getAll().then(data => { setSlides(data); setLoading(false); });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (slide: Slide) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle ?? '',
      description: slide.description,
      image_url: slide.image_url,
      cta1_text: slide.cta1_text ?? '',
      cta1_link: slide.cta1_link ?? '',
      cta2_text: slide.cta2_text ?? '',
      cta2_link: slide.cta2_link ?? '',
      is_active: slide.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      description: form.description,
      image_url: form.image_url,
      cta1_text: form.cta1_text || null,
      cta1_link: form.cta1_link || null,
      cta2_text: form.cta2_text || null,
      cta2_link: form.cta2_link || null,
      is_active: form.is_active,
    };

    if (editing) {
      const updated = await slidesHelper.update(editing.id, payload);
      setSlides(prev => prev.map(s => s.id === editing.id ? updated : s));
    } else {
      const maxPos = slides.reduce((max, s) => Math.max(max, s.order_position), 0);
      const created = await slidesHelper.create({ ...payload, order_position: maxPos + 1 });
      setSlides(prev => [...prev, created]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await slidesHelper.delete(deleteId);
    setSlides(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  const toggleActive = async (slide: Slide) => {
    const updated = await slidesHelper.update(slide.id, { is_active: !slide.is_active });
    setSlides(prev => prev.map(s => s.id === slide.id ? updated : s));
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === slides.length - 1)) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newSlides = [...slides];
    [newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]];

    const updates = newSlides.map((s, i) => ({ id: s.id, order_position: i + 1 }));
    setSlides(newSlides.map((s, i) => ({ ...s, order_position: i + 1 })));
    await slidesHelper.updateOrder(updates);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseAvailable()) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, image_url: url }));
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `slides/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filePath, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
      setForm(prev => ({ ...prev, image_url: publicUrl }));
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hero Slider</h1>
          <p className="text-gray-400 text-sm mt-1">Διαχείριση slides για το hero section της αρχικής σελίδας</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Νέο Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="card p-12 text-center">
          <Image size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Δεν υπάρχουν slides</h3>
          <p className="text-gray-500 mb-4">Προσθέστε το πρώτο slide για το hero section.</p>
          <button onClick={openAdd} className="btn-primary mx-auto">
            <Plus size={18} /> Προσθήκη Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="card p-0 overflow-hidden flex flex-col sm:flex-row items-stretch group transition-all hover:border-gray-700">
              <div className="w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 relative overflow-hidden bg-gray-800">
                {slide.image_url ? (
                  <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image size={32} className="text-gray-600" />
                  </div>
                )}
                {!slide.is_active && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">Ανενεργό</span>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex items-center gap-4 min-w-0">
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveSlide(slide.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <GripVertical size={16} className="text-gray-600 mx-auto" />
                  <button
                    onClick={() => moveSlide(slide.id, 'down')}
                    disabled={idx === slides.length - 1}
                    className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">#{idx + 1}</span>
                    <h3 className="font-semibold text-white truncate">{slide.title}</h3>
                  </div>
                  {slide.subtitle && <p className="text-sm text-blue-400 mb-1">{slide.subtitle}</p>}
                  <p className="text-xs text-gray-400 truncate">{slide.description}</p>
                  {(slide.cta1_text || slide.cta2_text) && (
                    <div className="flex gap-2 mt-2">
                      {slide.cta1_text && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                          <LinkIcon size={10} /> {slide.cta1_text}
                        </span>
                      )}
                      {slide.cta2_text && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          <LinkIcon size={10} /> {slide.cta2_text}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${slide.is_active ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}
                    title={slide.is_active ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                  >
                    {slide.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => openEdit(slide)} className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                    <Type size={16} />
                  </button>
                  <button onClick={() => setDeleteId(slide.id)} className="p-2 rounded-lg bg-gray-800 text-red-400 hover:bg-red-600/20 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 rounded-t-2xl z-10">
              <h2 className="text-lg font-bold">{editing ? 'Επεξεργασία Slide' : 'Νέο Slide'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Εικόνα</label>
                {form.image_url ? (
                  <div className="relative rounded-xl overflow-hidden h-48 bg-gray-800 group">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 backdrop-blur-sm">
                        Αλλαγή
                      </button>
                      <button onClick={() => setForm(prev => ({ ...prev, image_url: '' }))} className="px-3 py-1.5 bg-red-500/20 text-red-300 text-sm rounded-lg hover:bg-red-500/30 backdrop-blur-sm">
                        Αφαίρεση
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Image size={32} />
                        <span className="text-sm">Επιλέξτε εικόνα ή σύρτε εδώ</span>
                      </>
                    )}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="mt-2">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="ή επικολλήστε URL εικόνας..."
                    className="input text-xs"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Τίτλος *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="π.χ. Φρέσκο Ψωμί Κάθε Μέρα"
                  className="input"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Υπότιτλος</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="π.χ. Από το 1985"
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Περιγραφή</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Σύντομη περιγραφή για το slide..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">CTA Button 1</label>
                  <input
                    type="text"
                    value={form.cta1_text}
                    onChange={e => setForm(prev => ({ ...prev, cta1_text: e.target.value }))}
                    placeholder="Κείμενο κουμπιού"
                    className="input"
                  />
                  <input
                    type="text"
                    value={form.cta1_link}
                    onChange={e => setForm(prev => ({ ...prev, cta1_link: e.target.value }))}
                    placeholder="Link (π.χ. /products)"
                    className="input"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">CTA Button 2</label>
                  <input
                    type="text"
                    value={form.cta2_text}
                    onChange={e => setForm(prev => ({ ...prev, cta2_text: e.target.value }))}
                    placeholder="Κείμενο κουμπιού"
                    className="input"
                  />
                  <input
                    type="text"
                    value={form.cta2_link}
                    onChange={e => setForm(prev => ({ ...prev, cta2_link: e.target.value }))}
                    placeholder="Link (π.χ. /contact)"
                    className="input"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-gray-300">{form.is_active ? 'Ενεργό — εμφανίζεται στο website' : 'Ανενεργό — κρυμμένο από τους επισκέπτες'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-800 sticky bottom-0 bg-gray-900 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Ακύρωση</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="btn-primary disabled:opacity-50">
                {saving ? 'Αποθήκευση...' : editing ? 'Ενημέρωση' : 'Δημιουργία'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Διαγραφή Slide</h3>
            <p className="text-gray-400 text-sm mb-6">Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το slide; Η ενέργεια δεν μπορεί να αναιρεθεί.</p>
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
