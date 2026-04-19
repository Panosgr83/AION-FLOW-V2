import { Link } from 'react-router-dom';
import { Zap, BarChart3, Users, ShoppingBag, Package, ArrowRight, CheckCircle, Star, TrendingUp, Shield, Globe } from 'lucide-react';

const features = [
  { icon: ShoppingBag, title: 'Διαχείριση Παραγγελιών', desc: 'Παρακολουθήστε όλες τις παραγγελίες σε πραγματικό χρόνο με πλήρη ιστορικό και ενημερώσεις κατάστασης.' },
  { icon: Users, title: 'CRM Πελατών', desc: 'Πλήρες προφίλ πελατών με επίπεδα loyalty, ιστορικό αγορών και αναλυτικά στοιχεία.' },
  { icon: BarChart3, title: 'Αναλυτικά Στοιχεία', desc: 'Διαδραστικά γραφήματα και KPIs για έσοδα, μετατροπές και απόδοση καταστήματος.' },
  { icon: Package, title: 'Inventory Management', desc: 'Διαχείριση αποθέματος με αυτόματες ειδοποιήσεις χαμηλού stock και πολλαπλές παραλλαγές.' },
  { icon: Globe, title: 'SEO & Media', desc: 'Βελτιστοποίηση περιεχομένου με SEO metadata και ολοκληρωμένη διαχείριση media.' },
  { icon: Shield, title: 'Ασφαλής Πρόσβαση', desc: 'Role-based access control με Supabase Auth και Row Level Security για πλήρη ασφάλεια δεδομένων.' },
];

const stats = [
  { value: '10k+', label: 'Προϊόντα υπό διαχείριση' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '< 100ms', label: 'Χρόνος απόκρισης' },
  { value: '24/7', label: 'Διαθεσιμότητα' },
];

const testimonials = [
  { name: 'Αλέξανδρος Κ.', role: 'E-commerce Manager', text: 'Το AION FLOW άλλαξε εντελώς τον τρόπο που διαχειριζόμαστε το online store μας. Εξαιρετικό εργαλείο!', rating: 5 },
  { name: 'Δήμητρα Π.', role: 'Digital Entrepreneur', text: 'Τέλεια ισορροπία μεταξύ δύναμης και απλότητας. Η ομάδα μας έγινε 3x πιο αποτελεσματική.', rating: 5 },
  { name: 'Μιχάλης Σ.', role: 'Startup Founder', text: 'Από την πρώτη μέρα είχαμε πλήρη ορατότητα στα δεδομένα μας. Απλά δεν υπάρχει καλύτερο CMS.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-dark">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>AION FLOW</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Χαρακτηριστικά</a>
          <a href="#stats" className="hover:text-white transition-colors">Στατιστικά</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Κριτικές</a>
        </div>
        <Link to="/login" className="btn-primary text-sm px-5 py-2">
          Σύνδεση
          <ArrowRight size={14} />
        </Link>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <TrendingUp size={14} />
            <span>E-commerce CMS για επαγγελματίες</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Διαχειριστείτε το
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              e-shop σας
            </span>
            <br />
            με precision.
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ένα ολοκληρωμένο CMS για orders, customers, analytics και inventory.
            Powered by Supabase, built for speed.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login" className="btn-primary text-base px-8 py-3.5">
              Ξεκινήστε δωρεάν
              <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn-secondary text-base px-8 py-3.5">
              Demo →
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Demo mode: demo@aionflow.gr / demo123
          </p>
        </div>
      </section>

      <section id="stats" className="py-20 px-6 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Όλα όσα χρειάζεστε</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Ένα πλατφόρμα για όλη τη διαχείριση του e-commerce σας.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-6 hover:border-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Γιατί AION FLOW;</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Dual mode: Demo & Live Supabase',
              'Real-time data sync',
              'Row Level Security (RLS)',
              'Mobile-first responsive design',
              'Greek-first localization',
              'Glassmorphic premium UI',
              'Advanced analytics & charts',
              'Full order lifecycle management',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 py-3">
                <CheckCircle size={18} className="text-green-400 shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Τι λένε οι χρήστες</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12">
            <h2 className="text-3xl font-bold mb-4">Έτοιμοι να ξεκινήσετε;</h2>
            <p className="text-gray-400 mb-8">Δοκιμάστε το demo χωρίς εγγραφή. Πλήρης λειτουργικότητα, άμεσα.</p>
            <Link to="/login" className="btn-primary text-base px-8 py-4 inline-flex">
              Δοκιμάστε τώρα
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-gray-800/50 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
            <Zap size={10} className="text-white" />
          </div>
          <span className="text-gray-400 font-medium">AION FLOW</span>
        </div>
        <p>© 2024 AION FLOW. Powered by Supabase & React.</p>
      </footer>
    </div>
  );
}
