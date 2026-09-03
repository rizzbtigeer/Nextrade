import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { formatFCFA, getPriceForQty } from '../utils/pricing.js';
import { CITIES } from '../config.js';
import api from '../api/axios.js';

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [city, setCity] = useState(CITIES[0]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = useMemo(
    () => items.reduce((sum, i) => sum + getPriceForQty(i.priceTiers, i.qty) * i.qty, 0),
    [items]
  );

  const handleCheckout = async () => {
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders/whatsapp', {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        city,
        customerNote: note
      });
      clearCart();
      window.open(data.whatsappLink, '_blank');
      navigate('/commande-confirmee', { state: { whatsappLink: data.whatsappLink } });
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue, réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <ShoppingBag size={40} className="mx-auto text-ink-soft/40" />
        <h1 className="mt-4 font-display text-xl font-bold text-ink">Votre panier est vide</h1>
        <p className="mt-2 text-sm text-ink-soft">Parcourez le catalogue pour ajouter des articles.</p>
        <Link
          to="/catalogue"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-ink">Votre panier de gros</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => {
            const unitPrice = getPriceForQty(item.priceTiers, item.qty);
            return (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-card"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                  {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-[140px] flex-1">
                  <Link to={`/produit/${item.slug}`} className="text-sm font-semibold text-ink hover:text-brand">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-ink-soft tabular">{formatFCFA(unitPrice)} / unité</p>
                </div>
                <QuantityStepper
                  value={item.qty}
                  onChange={(qty) => updateQty(item.productId, qty)}
                  min={item.moq}
                />
                <p className="w-28 text-right font-semibold text-ink tabular">
                  {formatFCFA(unitPrice * item.qty)}
                </p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-ink-soft/50 transition hover:text-red-500"
                  aria-label={`Retirer ${item.name} du panier`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-xl bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-bold text-ink">Récapitulatif</h2>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Ville de livraison
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Note (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Précisions sur votre commande..."
              className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
            <span className="text-sm font-semibold text-ink-soft">Total</span>
            <span className="font-display text-xl font-bold text-brand tabular">
              {formatFCFA(total)}
            </span>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-dark disabled:opacity-60"
          >
            <MessageCircle size={18} />
            {submitting ? 'Préparation...' : 'Commander sur WhatsApp'}
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft">
            Le paiement et la livraison se négocient directement sur WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
