import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { formatFCFA } from '../../utils/pricing.js';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée'
};

const STATUS_STYLES = {
  pending: 'bg-gold/15 text-gold',
  confirmed: 'bg-whatsapp/15 text-whatsapp-dark',
  cancelled: 'bg-red-100 text-red-600'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Commandes</h1>

      {loading ? (
        <p className="mt-6 text-sm text-ink-soft">Chargement...</p>
      ) : orders.length ? (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                    {order.city && <span className="text-ink-soft"> — {order.city}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-brand tabular">
                    {formatFCFA(order.total)}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="mt-3 space-y-1 border-t border-ink/8 pt-3 text-sm text-ink-soft">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between tabular">
                    <span>{item.name} × {item.qty}</span>
                    <span>{formatFCFA(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
              {order.customerNote && (
                <p className="mt-2 rounded-md bg-paper p-2 text-xs text-ink-soft">
                  Note : {order.customerNote}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-ink-soft">
          Aucune commande pour le moment.
        </p>
      )}
    </div>
  );
}
