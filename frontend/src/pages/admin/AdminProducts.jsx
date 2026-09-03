import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import api from '../../api/axios.js';
import { formatFCFA, lowestTierPrice } from '../../utils/pricing.js';
import { ADMIN_BASE_PATH } from '../../config.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/products/admin/all')
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Articles</h1>
        <Link
          to={`/${ADMIN_BASE_PATH}/produits/nouveau`}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Nouvel article
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-ink-soft">Chargement...</p>
      ) : products.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-paper text-left text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Article</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Dès</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Clics</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-ink/8">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 tabular text-ink-soft">
                    {formatFCFA(lowestTierPrice(p.priceTiers))}
                  </td>
                  <td className="px-4 py-3 tabular text-ink-soft">{p.stock}</td>
                  <td className="px-4 py-3 tabular text-ink-soft">{p.clicks}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.available ? 'bg-whatsapp/10 text-whatsapp-dark' : 'bg-ink/10 text-ink-soft'
                      }`}
                    >
                      {p.available ? 'Publié' : 'Masqué'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/produit/${p.slug}`} target="_blank" className="text-ink-soft hover:text-brand" aria-label="Voir">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/${ADMIN_BASE_PATH}/produits/${p._id}/editer`} className="text-ink-soft hover:text-brand" aria-label="Modifier">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="text-ink-soft hover:text-red-600" aria-label="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-ink-soft">
          Aucun article pour le moment. Créez le premier.
        </p>
      )}
    </div>
  );
}
