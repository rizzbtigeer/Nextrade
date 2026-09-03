import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, MessageCircle, ChevronLeft } from 'lucide-react';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import PriceTierTable from '../components/PriceTierTable.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { formatFCFA, getPriceForQty } from '../utils/pricing.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        setQty(data.moq || 1);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-ink-soft">Chargement...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-ink-soft">Article introuvable.</p>
        <Link to="/catalogue" className="mt-4 inline-block text-brand font-semibold hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const unitPrice = getPriceForQty(product.priceTiers, qty);
  const total = unitPrice * qty;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleOrderNow = () => {
    addToCart(product, qty);
    navigate('/panier');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/catalogue" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand">
        <ChevronLeft size={16} /> Retour au catalogue
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galerie */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-card">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-soft/30">
                <Package size={64} />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 transition ${
                    activeImage === idx ? 'border-brand' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          {product.category?.name && (
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-6 rounded-xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Paliers de prix (par unité)
            </p>
            <div className="mt-3">
              <PriceTierTable priceTiers={product.priceTiers} activeQty={qty} />
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-ink-soft">Quantité (min. {product.moq})</p>
                <div className="mt-1.5">
                  <QuantityStepper value={qty} onChange={setQty} min={product.moq} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-soft">Total pour {qty} unité{qty > 1 ? 's' : ''}</p>
                <p className="font-display text-2xl font-bold text-brand tabular">
                  {formatFCFA(total)}
                </p>
                <p className="text-xs text-ink-soft tabular">soit {formatFCFA(unitPrice)} / unité</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand-50"
              >
                <ShoppingCart size={18} />
                {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
              </button>
              <button
                onClick={handleOrderNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-dark"
              >
                <MessageCircle size={18} />
                Commander maintenant
              </button>
            </div>
          </div>

          {product.stock > 0 && (
            <p className="mt-4 text-xs text-ink-soft">
              Stock disponible : {product.stock} unités
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
