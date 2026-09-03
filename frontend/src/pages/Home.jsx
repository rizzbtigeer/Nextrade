import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Tags,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Zap,
  Headphones,
  ArrowRight
} from 'lucide-react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import CategoryStrip from '../components/CategoryStrip.jsx';
import { BRAND_TAGLINE, BRAND_NAME } from '../config.js';

// ============================================================
// COMPOSANT CARROUSEL HERO
// ============================================================
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Ne monte les slides 2 à 4 qu'après le premier rendu : la première image
  // (celle vue immédiatement par le visiteur, donc critique pour la vitesse
  // perçue du site) est la seule chargée par le navigateur au démarrage.
  const [restLoaded, setRestLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRestLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);
  
  const slides = [
    {
      image: '/hero/hero-1.jpg',
      title: 'Habits en gros',
      description: 'T-shirts, jeans, vestes... Des prix imbattables pour les revendeurs',
      category: 'Habits'
    },
    {
      image: '/hero/hero-2.jpg',
      title: 'Chaussures de qualité',
      description: 'Baskets, chaussures habillées, sandales... Toutes les tendances',
      category: 'Chaussures'
    },
    {
      image: '/hero/hero-3.jpg',
      title: 'Montres & Accessoires',
      description: 'Des montres élégantes pour tous les styles et budgets',
      category: 'Montres'
    },
    {
      image: '/hero/hero-4.jpg',
      title: 'Livraison rapide',
      description: 'Nous livrons partout au Cameroun en 48h',
      category: 'Livraison'
    }
  ];

  // Auto-défilement toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => {
        if (index !== 0 && !restLoaded) return null;
        return (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          {/* Contenu de la slide */}
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
              <div className="max-w-2xl text-white">
                {/* Logo */}
                <div className="mb-4 flex items-center gap-3">
                  <img 
                    src="/logo.png" 
                    alt={BRAND_NAME}
                    className="h-12 w-auto object-contain rounded-lg bg-white/10 p-2"
                  />
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
                    ⭐ Grossiste depuis 2025
                  </span>
                </div>

                {/* Catégorie */}
                <span className="inline-block rounded-full bg-brand/20 px-4 py-1.5 text-sm font-semibold text-brand">
                  {slide.category}
                </span>
                
                {/* Titre */}
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                
                {/* Description */}
                <p className="mt-4 text-lg text-white/80 sm:text-xl max-w-md">
                  {slide.description}
                </p>
                
                {/* Boutons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/catalogue"
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark hover:scale-105"
                  >
                    <ShoppingBag size={20} />
                    Voir le catalogue
                  </Link>
                  <a
                    href="https://wa.me/237XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 hover:scale-105"
                  >
                    <MessageCircle size={20} />
                    Commander sur WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      {/* Boutons de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 hover:scale-110 z-20"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 hover:scale-110 z-20"
        aria-label="Slide suivant"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicateurs de défilement (points) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-gold' 
                : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Aller à la slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


// ============================================================
// COMPOSANT AVANTAGES
// ============================================================
function AdvantagesSection() {
  const advantages = [
    { icon: <Zap className="h-8 w-8 text-brand" />, title: 'Prix de gros', desc: 'Les meilleurs prix pour les revendeurs' },
    { icon: <Truck className="h-8 w-8 text-brand" />, title: 'Livraison rapide', desc: 'Partout au Cameroun en 48h' },
    { icon: <ShieldCheck className="h-8 w-8 text-brand" />, title: 'Qualité garantie', desc: 'Produits authentiques et contrôlés' },
    { icon: <Headphones className="h-8 w-8 text-brand" />, title: 'Support client', desc: 'Disponible 7j/7 sur WhatsApp' }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Pourquoi choisir {BRAND_NAME} ?
          </h2>
          <p className="mt-2 text-ink-soft">Les avantages qui font la différence</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((adv) => (
            <div key={adv.title} className="rounded-2xl bg-white p-6 text-center shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                {adv.icon}
              </div>
              <h3 className="mt-4 font-semibold text-ink">{adv.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPOSANT COMMENT ÇA MARCHE
// ============================================================
function HowItWorksSection() {
  const steps = [
    { step: 'Parcourez le catalogue', icon: '🛒', desc: 'Choisissez vos articles et quantités' },
    { step: 'Prix automatique', icon: '💰', desc: 'Le prix de gros s\'applique selon la quantité' },
    { step: 'Validez votre panier', icon: '📋', desc: 'Incluez votre ville de livraison' },
    { step: 'Confirmation WhatsApp', icon: '💬', desc: 'Disponibilité, livraison, paiement' }
  ];

  return (
    <section id="comment-ca-marche" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-ink">Comment ça marche ?</h2>
          <p className="text-sm text-ink-soft">En 4 étapes simples, passez votre commande</p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-4">
          {steps.map((item, idx) => (
            <li key={idx} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-2xl text-white">
                {item.icon}
              </div>
              <div className="absolute -right-3 top-5 hidden text-2xl text-ink-soft/20 lg:block">
                {idx < 3 && '→'}
              </div>
              <p className="mt-3 font-semibold text-ink">{item.step}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ============================================================
// COMPOSANT CTA WHATSAPP
// ============================================================
function WhatsAppCTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-center text-white sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <MessageCircle size={40} />
            </div>
            <h2 className="font-display text-3xl font-bold">
              Prêt à commander en gros ?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-green-50">
              Contactez-nous directement sur WhatsApp pour discuter de vos besoins
            </p>
            <a
              href="https://wa.me/237XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-green-600 transition hover:scale-105 hover:shadow-xl"
            >
              <MessageCircle size={20} />
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPOSANT TÉMOIGNAGES
// ============================================================
function TestimonialsSection() {
  const testimonials = [
    { name: 'Marie Douala', role: 'Revendeuse', text: 'Gros237 m\'a permis de développer mon activité. Les prix sont imbattables !' },
    { name: 'Jean Yaoundé', role: 'Boutiquier', text: 'Livraison rapide et produits de qualité. Je recommande vivement.' },
    { name: 'Paul Bafoussam', role: 'Commerçant', text: 'Le service client est excellent et les prix sont très compétitifs.' }
  ];

  return (
    <section className="bg-ink text-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold">
            Ce que disent nos clients
          </h2>
          <p className="mt-2 text-white/70">Ils nous font confiance</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((test) => (
            <div key={test.name} className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm hover:bg-white/20 transition">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-white/90">"{test.text}"</p>
              <div className="mt-4">
                <p className="font-semibold">{test.name}</p>
                <p className="text-sm text-white/60">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PAGE HOME PRINCIPALE
// ============================================================
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { limit: 8 } })
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO CARROUSEL ===== */}
      <HeroCarousel />

      

      {/* ===== CATÉGORIES ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Catégories
            </h2>
            <p className="text-ink-soft text-sm">Parcourez nos catégories populaires</p>
          </div>
          <Link to="/catalogue" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        <CategoryStrip />
      </div>

      {/* ===== PRODUITS EN VEDETTE ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Articles en vedette</h2>
            <p className="text-sm text-ink-soft">Les produits les plus populaires</p>
          </div>
          <Link to="/catalogue" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
            Voir tout le catalogue <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-ink/5" />
            ))}
          </div>
        ) : products.length ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-soft">
            Aucun article publié pour le moment — revenez bientôt.
          </p>
        )}
      </div>

      {/* ===== AVANTAGES ===== */}
      <AdvantagesSection />

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <HowItWorksSection />

      {/* ===== CTA WHATSAPP ===== */}
      <WhatsAppCTASection />

      {/* ===== TÉMOIGNAGES ===== */}
      <TestimonialsSection />
    </div>
  );
}