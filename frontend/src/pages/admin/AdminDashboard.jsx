import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { ShoppingBag, Package, Tags, Wallet } from 'lucide-react';
import api from '../../api/axios.js';
import { formatFCFA } from '../../utils/pricing.js';

const STATUS_COLORS = { pending: '#F5A623', confirmed: '#22C55E', cancelled: '#DC2626' };
const STATUS_LABELS = { pending: 'En attente', confirmed: 'Confirmées', cancelled: 'Annulées' };

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-ink-soft">{label}</p>
        <p className="font-display text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stats/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Impossible de charger les statistiques pour le moment.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-ink-soft">Chargement du tableau de bord...</p>;
  }

  if (error || !stats) {
    return <p className="rounded-xl bg-white p-6 text-sm text-red-600 shadow-card">{error}</p>;
  }

  const chartData = stats.ordersByDay.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }));

  const pieData = Object.entries(stats.statusCounts).map(([key, value]) => ({
    key,
    name: STATUS_LABELS[key],
    value
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-ink-soft">Activité de votre boutique en un coup d'œil.</p>

      {/* Chiffres clés */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Commandes reçues" value={stats.totals.orders} />
        <StatCard icon={Wallet} label="Chiffre d'affaires estimé" value={formatFCFA(stats.totals.revenue)} />
        <StatCard icon={Package} label="Articles publiés" value={stats.totals.products} />
        <StatCard icon={Tags} label="Catégories" value={stats.totals.categories} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Courbe des commandes sur 14 jours */}
        <div className="rounded-xl bg-white p-4 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Commandes des 14 derniers jours</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9480F" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#D9480F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0F1B2D10" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#33415C' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#33415C' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => (name === 'count' ? [value, 'Commandes'] : [formatFCFA(value), 'CA'])}
                  labelFormatter={(label) => `Le ${label}`}
                  contentStyle={{ borderRadius: 8, borderColor: '#0F1B2D20', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="count" stroke="#D9480F" strokeWidth={2} fill="url(#ordersFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des commandes par statut */}
        <div className="rounded-xl bg-white p-4 shadow-card">
          <h2 className="text-sm font-semibold text-ink">Statut des commandes</h2>
          <div className="mt-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#0F1B2D20', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-ink-soft">
            {pieData.map((entry) => (
              <span key={entry.key} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.key] }} />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top articles par clics */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Articles les plus consultés</h2>
        {stats.topProducts.length ? (
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#0F1B2D10" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#33415C' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11, fill: '#33415C' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => [value, 'Clics']} contentStyle={{ borderRadius: 8, borderColor: '#0F1B2D20', fontSize: 12 }} />
                <Bar dataKey="clicks" fill="#D9480F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">Pas encore assez de données pour ce graphique.</p>
        )}
      </div>
    </div>
  );
}
