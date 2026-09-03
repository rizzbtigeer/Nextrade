// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, Tags, ClipboardList, LogOut, Store, Users, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND_NAME, ADMIN_BASE_PATH } from '../../config.js';

const links = [
  { to: `/${ADMIN_BASE_PATH}/tableau-de-bord`, label: 'Tableau de bord', icon: LayoutDashboard },
  { to: `/${ADMIN_BASE_PATH}/produits`, label: 'Articles', icon: Package },
  { to: `/${ADMIN_BASE_PATH}/categories`, label: 'Catégories', icon: Tags },
  { to: `/${ADMIN_BASE_PATH}/commandes`, label: 'Commandes', icon: ClipboardList },
  { to: `/${ADMIN_BASE_PATH}/admins`, label: 'Administrateurs', icon: Users }
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(`/${ADMIN_BASE_PATH}/login`);
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
          <Store size={16} />
        </span>
        <span className="font-display font-bold text-ink">{BRAND_NAME}</span>
      </div>
      <p className="mt-1 px-2 text-xs text-ink-soft">Connecté : {admin?.username}</p>

      <nav className="mt-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-ink-soft hover:bg-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-white"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </>
  );

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl gap-8 px-4 py-4 sm:px-6 sm:py-8 lg:flex-row flex-col">
      {/* Barre mobile : bouton pour ouvrir le menu admin */}
      <div className="flex items-center justify-between lg:hidden">
        <span className="font-display font-bold text-ink">{BRAND_NAME} · Admin</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-ink/15 p-2 text-ink-soft"
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {mobileOpen && (
        <aside className="rounded-lg border border-ink/10 bg-paper p-3 lg:hidden">
          <NavContent />
        </aside>
      )}

      {/* Menu latéral : visible en permanence à partir de la taille "desktop" (lg) */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <NavContent />
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
