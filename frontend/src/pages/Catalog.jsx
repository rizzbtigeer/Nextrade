import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { search, category, page, limit: 12 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-ink">Catalogue</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <SlidersHorizontal size={16} /> Catégories
          </div>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  !category ? 'bg-brand text-white' : 'text-ink-soft hover:bg-white'
                }`}
              >
                Toutes les catégories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => updateParam('category', cat._id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    category === cat._id ? 'bg-brand text-white' : 'text-ink-soft hover:bg-white'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {search && (
            <p className="mb-4 text-sm text-ink-soft">
              Résultats pour « {search} »
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-ink/5" />
              ))}
            </div>
          ) : products.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam('page', String(i + 1))}
                      className={`h-9 w-9 rounded-md text-sm font-semibold transition ${
                        page === i + 1
                          ? 'bg-brand text-white'
                          : 'bg-white text-ink-soft hover:bg-ink/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="rounded-xl bg-white p-10 text-center text-sm text-ink-soft">
              Aucun article ne correspond à votre recherche.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
