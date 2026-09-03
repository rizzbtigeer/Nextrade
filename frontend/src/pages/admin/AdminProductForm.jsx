// src/pages/admin/AdminProductForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ChevronLeft, AlertCircle, Save } from 'lucide-react';
import api from '../../api/axios.js';
import ImageUploader from '../../components/ImageUploader.jsx';
import { ADMIN_BASE_PATH } from '../../config.js';

const emptyTier = { minQty: '', price: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [priceTiers, setPriceTiers] = useState([{ minQty: 1, price: '' }]);
  const [moq, setMoq] = useState(1);
  const [stock, setStock] = useState(0);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => setError('Erreur chargement catégories'));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    api.get('/products/admin/all')
      .then(({ data }) => {
        const product = data.find((p) => p._id === id);
        if (product) {
          setName(product.name || '');
          setDescription(product.description || '');
          setCategory(product.category?._id || product.category || '');
          setImages(product.images || []);
          setPriceTiers(product.priceTiers?.length ? product.priceTiers : [{ minQty: 1, price: '' }]);
          setMoq(product.moq || 1);
          setStock(product.stock || 0);
          setAvailable(product.available !== undefined ? product.available : true);
        }
      })
      .catch(() => setError('Erreur chargement produit'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateTier = (idx, field, value) => {
    setPriceTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const addTier = () => setPriceTiers((prev) => [...prev, { ...emptyTier }]);
  const removeTier = (idx) => {
    if (priceTiers.length <= 1) return;
    setPriceTiers((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!category) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    const cleanTiers = priceTiers.filter(t => t.minQty !== '' && t.price !== '');
    if (cleanTiers.length === 0) {
      setError('Ajoutez au moins un palier de prix valide');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const cleanTiers = priceTiers
      .filter((t) => t.minQty !== '' && t.price !== '')
      .map((t) => ({ 
        minQty: Number(t.minQty), 
        price: Number(t.price) 
      }))
      .sort((a, b) => a.minQty - b.minQty);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      images: images.filter(Boolean),
      priceTiers: cleanTiers,
      moq: Number(moq),
      stock: Number(stock),
      available
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        setSuccess('Produit modifié avec succès');
      } else {
        await api.post('/products', payload);
        setSuccess('Produit créé avec succès');
      }
      setTimeout(() => navigate(`/${ADMIN_BASE_PATH}/produits`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="mt-2 text-sm text-ink-soft">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/${ADMIN_BASE_PATH}/produits`)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand transition"
      >
        <ChevronLeft size={16} /> Retour aux articles
      </button>

      <h1 className="font-display text-2xl font-bold text-ink">
        {isEdit ? "Modifier l'article" : 'Nouvel article'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-card">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Nom du produit"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Description du produit"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Choisir une catégorie...</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Photos de l'article
          </label>
          <div className="mt-1.5">
            <ImageUploader images={images} onChange={setImages} maxImages={6} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Paliers de prix <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5 space-y-2">
            {priceTiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={tier.minQty}
                  onChange={(e) => updateTier(idx, 'minQty', e.target.value)}
                  placeholder="Qté min."
                  className="w-28 rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <span className="text-xs text-ink-soft">unités →</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={tier.price}
                  onChange={(e) => updateTier(idx, 'price', e.target.value)}
                  placeholder="Prix FCFA"
                  className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                {priceTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="text-ink-soft hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTier}
              className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark transition"
            >
              <Plus size={14} /> Ajouter un palier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">MOQ</label>
            <input
              type="number"
              min={1}
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Stock</label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-ink/15 text-brand focus:ring-brand"
          />
          Article visible sur le site
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
            <Save size={16} />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enregistrement...
            </span>
          ) : (
            isEdit ? 'Enregistrer les modifications' : "Créer l'article"
          )}
        </button>
      </form>
    </div>
  );
}