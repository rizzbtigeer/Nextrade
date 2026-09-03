import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageLoader from './components/PageLoader.jsx';
import { ADMIN_BASE_PATH } from './config.js';

// Pages publiques principales : chargées immédiatement (parcours d'achat prioritaire)
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';

// Pages secondaires : chargées à la demande seulement (réduit le poids du
// premier chargement du site, qui est ce que la majorité des visiteurs verront)
const APropos = lazy(() => import('./pages/legal/APropos.jsx'));
const ConditionsUtilisation = lazy(() => import('./pages/legal/ConditionsUtilisation.jsx'));
const Confidentialite = lazy(() => import('./pages/legal/Confidentialite.jsx'));
const MentionsLegales = lazy(() => import('./pages/legal/MentionsLegales.jsx'));

// Back-office : jamais chargé par un visiteur normal, donc entièrement à la demande
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm.jsx'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminAdmins = lazy(() => import('./pages/admin/AdminAdmins.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Site public (front-office) */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalog />} />
                  <Route path="/produit/:slug" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/commande-confirmee" element={<OrderConfirmation />} />
                  <Route path="/a-propos" element={<APropos />} />
                  <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
                  <Route path="/confidentialite" element={<Confidentialite />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Back-office (admin) — chemin configurable via VITE_ADMIN_BASE_PATH, voir config.js */}
        <Route path={`/${ADMIN_BASE_PATH}/login`} element={<AdminLogin />} />
        <Route
          path={`/${ADMIN_BASE_PATH}`}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="tableau-de-bord" replace />} />
          <Route path="tableau-de-bord" element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="produits/nouveau" element={<AdminProductForm />} />
          <Route path="produits/:id/editer" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="admins" element={<AdminAdmins />} />
        </Route>

        {/* Si le chemin admin a bien été personnalisé, "/admin" classique ne mène nulle part
            plutôt que de révéler l'existence d'un back-office à cette adresse. */}
        {ADMIN_BASE_PATH !== 'admin' && <Route path="/admin/*" element={<Navigate to="/" replace />} />}
      </Routes>
    </Suspense>
  );
}
