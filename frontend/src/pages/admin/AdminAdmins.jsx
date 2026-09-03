// src/pages/admin/AdminAdmins.js
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Shield } from 'lucide-react';
import api from '../../api/axios.js';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingUsername, setEditingUsername] = useState('');
  const [editingPassword, setEditingPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger la liste des admins
  const load = () => {
    setLoading(true);
    api.get('/auth/admins')
      .then(({ data }) => setAdmins(data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Erreur de chargement');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Créer un nouvel admin
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username.trim() || !password.trim()) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await api.post('/auth/create-admin', { 
        username: username.trim(), 
        password: password.trim() 
      });
      setSuccess('Administrateur créé avec succès');
      setUsername('');
      setPassword('');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  // Modifier un admin (nom d'utilisateur)
  const startEdit = (admin) => {
    setEditingId(admin._id);
    setEditingUsername(admin.username);
    setEditingPassword('');
    setError('');
    setSuccess('');
  };

  // Sauvegarder les modifications
  const saveEdit = async (id) => {
    setError('');
    setSuccess('');

    if (!editingUsername.trim()) {
      setError("Le nom d'utilisateur ne peut pas être vide");
      return;
    }

    try {
      const payload = { username: editingUsername.trim() };
      // Si un nouveau mot de passe est fourni, l'ajouter
      if (editingPassword.trim()) {
        if (editingPassword.trim().length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
        payload.password = editingPassword.trim();
      }

      await api.put(`/auth/admins/${id}`, payload);
      setSuccess('Administrateur modifié avec succès');
      setEditingId(null);
      setEditingUsername('');
      setEditingPassword('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  // Supprimer un admin
  const handleDelete = async (id, username) => {
    // Empêcher de se supprimer soi-même
    const currentAdmin = JSON.parse(localStorage.getItem('admin'));
    if (currentAdmin?._id === id) {
      setError("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }

    if (!confirm(`Supprimer l'administrateur "${username}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await api.delete(`/auth/admins/${id}`);
      setSuccess('Administrateur supprimé');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditingUsername('');
    setEditingPassword('');
    setError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">
          Administrateurs
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus size={16} /> Nouvel admin
          </button>
        )}
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-ink">Créer un administrateur</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="password"
              placeholder="Mot de passe (min 6 caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Créer
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setUsername('');
                setPassword('');
                setError('');
              }}
              className="rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-paper"
            >
              Annuler
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-sm text-whatsapp-dark">{success}</p>}
        </form>
      )}

      {/* Messages de feedback */}
      {!showForm && (error || success) && (
        <div className="mt-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-whatsapp-dark">{success}</p>}
        </div>
      )}

      {/* Liste des administrateurs */}
      {loading ? (
        <p className="mt-6 text-sm text-ink-soft">Chargement...</p>
      ) : admins.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    Administrateurs
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isEditing = editingId === admin._id;
                const currentAdmin = JSON.parse(localStorage.getItem('admin'));
                const isSelf = currentAdmin?._id === admin._id;

                return (
                  <tr key={admin._id} className="border-t border-ink/8">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingUsername}
                          onChange={(e) => setEditingUsername(e.target.value)}
                          className="w-full rounded-md border border-ink/15 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ink">{admin.username}</span>
                          {isSelf && (
                            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                              Vous
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="password"
                          placeholder="Nouveau mot de passe (optionnel)"
                          value={editingPassword}
                          onChange={(e) => setEditingPassword(e.target.value)}
                          className="w-full rounded-md border border-ink/15 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      ) : (
                        <span className="text-ink-soft">admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(admin._id)}
                              className="text-whatsapp-dark hover:text-green-700"
                              aria-label="Enregistrer"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-ink-soft hover:text-red-600"
                              aria-label="Annuler"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(admin)}
                              className="text-ink-soft hover:text-brand"
                              aria-label="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id, admin.username)}
                              className={`text-ink-soft ${isSelf ? 'cursor-not-allowed opacity-50' : 'hover:text-red-600'}`}
                              aria-label="Supprimer"
                              disabled={isSelf}
                              title={isSelf ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-ink-soft">
          Aucun administrateur pour le moment.
        </div>
      )}
    </div>
  );
}