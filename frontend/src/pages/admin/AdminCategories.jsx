// src/pages/admin/AdminCategories.jsx
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Search, AlertCircle } from 'lucide-react';
import api from '../../api/axios.js';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les catégories - CORRIGÉ
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
      setFilteredCategories(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  // useEffect avec la bonne syntaxe - CORRIGÉ
  useEffect(() => {
    load();
  }, []); // Tableau de dépendances vide

  // Filtrer les catégories en fonction de la recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(term)
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Créer une catégorie
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const name = newName.trim();
    if (!name) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    // Vérifier si la catégorie existe déjà (client-side)
    const exists = categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setError('Cette catégorie existe déjà');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/categories', { name });
      setSuccess('Catégorie créée avec succès');
      setNewName('');
      await load(); // Attendre que le chargement soit terminé
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Démarrer l'édition
  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setError('');
    setSuccess('');
  };

  // Sauvegarder les modifications
  const saveEdit = async (id) => {
    setError('');
    setSuccess('');
    
    const name = editingName.trim();
    if (!name) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    // Vérifier si le nouveau nom existe déjà (client-side)
    const exists = categories.some(cat => 
      cat._id !== id && cat.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setError('Une catégorie avec ce nom existe déjà');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/categories/${id}`, { name });
      setSuccess('Catégorie modifiée avec succès');
      setEditingId(null);
      setEditingName('');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer la catégorie "${name}" ? Cette action est irréversible.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.delete(`/categories/${id}`);
      setSuccess(`Catégorie "${name}" supprimée avec succès`);
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Catégories</h1>
        <span className="text-sm text-ink-soft">
          {categories.length} catégorie{categories.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Barre de recherche et formulaire */}
      <div className="mt-6 space-y-4">
        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une catégorie..."
            className="w-full rounded-md border border-ink/15 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Formulaire de création */}
        <form onSubmit={handleCreate} className="flex max-w-md gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nouvelle catégorie (ex: Chaussures)"
            className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newName.trim()}
            className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Ajouter
          </button>
        </form>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}
      </div>

      {/* Liste des catégories */}
      <div className="mt-6 overflow-hidden rounded-xl border border-ink/10 bg-white">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent"></div>
            <p className="mt-2 text-sm text-ink-soft">Chargement...</p>
          </div>
        ) : filteredCategories.length ? (
          <div className="divide-y divide-ink/8">
            {filteredCategories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between px-4 py-3 transition hover:bg-paper/50">
                <div className="flex-1 min-w-0">
                  {editingId === cat._id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full rounded-md border border-ink/15 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      autoFocus
                      disabled={isSubmitting}
                    />
                  ) : (
                    <span className="text-sm font-medium text-ink truncate block">{cat.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {editingId === cat._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(cat._id)}
                        disabled={isSubmitting || !editingName.trim()}
                        className="text-whatsapp-dark transition hover:text-green-700 disabled:opacity-50"
                        aria-label="Enregistrer"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSubmitting}
                        className="text-ink-soft transition hover:text-red-600"
                        aria-label="Annuler"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-ink-soft transition hover:text-brand"
                        aria-label="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="text-ink-soft transition hover:text-red-600"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            {searchTerm ? (
              <p className="text-sm text-ink-soft">
                Aucune catégorie ne correspond à "{searchTerm}"
              </p>
            ) : (
              <p className="text-sm text-ink-soft">
                Aucune catégorie pour le moment. Créez la première !
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pied de page avec statistiques */}
      {!loading && categories.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
          <span>
            {filteredCategories.length} sur {categories.length} catégorie{categories.length > 1 ? 's' : ''}
          </span>
          {searchTerm && filteredCategories.length === 0 && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-brand hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}
    </div>
  );
}