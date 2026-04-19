import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, BarChart2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsHelper } from '../../lib/dataHelpers';

type AnalyticsData = Awaited<ReturnType<typeof analyticsHelper.getDashboardData>>;

const DEVICE_ICONS = { Mobile: Smartphone, Desktop: Monitor, Tablet: Tablet };

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsHelper.getDashboardData().then(d => { setData(d); setLoading(false); });
  }, []);

  const formatter = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;
  if (!data) return null;

  const tooltipStyle = { background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', color: '#f3f4f6', fontSize: '12px' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold">Αναλυτικά Στοιχεία</h2>
        <p className="text-sm text-gray-500">Επισκόπηση απόδοσης καταστήματος</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Έσοδα', value: formatter.format(data.totalRevenue), change: `+${data.revenueChange}%`, pos: true, color: 'bg-blue-500/15 text-blue-400' },
          { icon: ShoppingCart, label: 'Παραγγελίες', value: data.totalOrders, change: `+${data.ordersChange}%`, pos: true, color: 'bg-green-500/15 text-green-400' },
          { icon: Users, label: 'Πελάτες', value: data.totalCustomers, change: `+${data.customersChange}%`, pos: true, color: 'bg-amber-500/15 text-amber-400' },
          { icon: BarChart2, label: 'Μετατροπή', value: `${data.conversionRate}%`, change: '+0.3%', pos: true, color: 'bg-cyan-500/15 text-cyan-400' },
        ].map(({ icon: Icon, label, value, change, pos, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
              <div className={`flex items-center gap-1 text-xs font-medium ${pos ? 'text-green-400' : 'text-red-400'}`}>
                {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-5">Μηνιαία Έσοδα & Παραγγελίες</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={data.monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad2)" name="Έσοδα" />
              <Bar yAxisId="right" dataKey="orders" fill="#10b981" opacity={0.7} radius={[4, 4, 0, 0]} name="Παραγγελίες" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-5">Top Προϊόντα (Έσοδα)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatter.format(v), 'Έσοδα']} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-5">Συσκευές</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data.deviceBreakdown} cx="50%" cy="50%" outerRadius={65} dataKey="percentage" nameKey="device" paddingAngle={3}>
                {data.deviceBreakdown.map((_, i) => (
                  <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b'][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Ποσοστό']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {data.deviceBreakdown.map((d, i) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b'];
              const icons = [Monitor, Smartphone, Tablet];
              const Icon = icons[i];
              return (
                <div key={d.device} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                    <Icon size={12} className="text-gray-400" />
                    <span className="text-gray-400 text-xs">{d.device}</span>
                  </div>
                  <span className="font-medium text-xs">{d.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5 md:col-span-2">
          <h3 className="font-semibold mb-4">Πηγές Επισκεψιμότητας</h3>
          <div className="space-y-3">
            {data.trafficSources.map(source => (
              <div key={source.source} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{source.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{source.sessions.toLocaleString()} sessions</span>
                    <span className="text-xs font-medium w-10 text-right">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Κατανομή Πωλήσεων ανά Κατηγορία</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data.salesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
              {data.salesByCategory.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Ποσοστό']} />
            <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
