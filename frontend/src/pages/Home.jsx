import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import {
  MessageCircle, ShieldCheck, Truck, ChevronLeft, ChevronRight,
  ShoppingBag, Star, Zap, Headphones, ArrowRight, BadgeCheck,
  PackageCheck, Users, TrendingUp, Award, Clock, CreditCard,
  MapPin, Phone, Mail, Store, Sparkles
} from 'lucide-react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import CategoryStrip from '../components/CategoryStrip.jsx';
import { BRAND_TAGLINE, BRAND_NAME, WHATSAPP_LINK } from '../config.js';

// ============================================================
// HERO CARROUSEL
// ============================================================
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {slides.map((slide, index) => {
        if (index !== 0 && !restLoaded) return null;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            </div>

            <div className="relative h-full flex items-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
                <div className="max-w-2xl text-white">
                  <div className="mb-4 flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt={BRAND_NAME}
                      className="h-12 w-auto object-contain rounded-lg bg-white/10 p-2"
                      loading="eager"
                    />
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
                      Grossiste depuis 2025
                    </span>
                  </div>

                  <span className="inline-block rounded-full bg-brand/20 px-4 py-1.5 text-sm font-semibold text-brand">
                    {slide.category}
                  </span>

                  <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>

                  <p className="mt-4 text-lg text-white/80 sm:text-xl max-w-md">
                    {slide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/catalogue"
                      className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <ShoppingBag size={20} />
                      Voir le catalogue
                    </Link>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
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

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 hover:scale-110 z-20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 hover:scale-110 z-20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Slide suivant"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-gold' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Aller à la slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BANDEAU CONFIANCE (nouveau - moderne)
// ============================================================
function TrustBar() {
  const items = [
    { icon: <Truck className="h-5 w-5" />, label: 'Livraison 48h' },
    { icon: <ShieldCheck className="h-5 w-5" />, label: 'Paiement sécurisé' },
    { icon: <BadgeCheck className="h-5 w-5" />, label: 'Produits vérifiés' },
    { icon: <Headphones className="h-5 w-5" />, label: 'Support 7j/7' }
  ];
  return (
    <div className="border-b border-ink/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="flex items-center justify-center gap-2 text-ink-soft">
              <span className="text-brand">{it.icon}</span>
              <span className="text-xs font-medium sm:text-sm">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STATISTIQUES (nouveau - moderne)
// ============================================================
function StatsSection() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '250+', label: 'Clients actifs' },
    { icon: <PackageCheck className="h-6 w-6" />, value: '1 000+', label: 'Commandes livrées' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '150+', label: 'Nouveaux articles / mois' },
    { icon: <Award className="h-6 w-6" />, value: '4.9/5', label: 'Satisfaction client' }
  ];
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,80,0.08),transparent_60%)]"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:border-gold/40 hover:bg-white/10"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                {s.icon}
              </div>
              <div className="mt-4 font-display text-3xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// AVANTAGES
// ============================================================
function AdvantagesSection() {
  const advantages = [
    { icon: <Zap className="h-7 w-7 text-brand" />, title: 'Prix de gros', desc: 'Les meilleurs prix pour les revendeurs' },
    { icon: <Truck className="h-7 w-7 text-brand" />, title: 'Livraison rapide', desc: 'Partout au Cameroun en 48h' },
    { icon: <ShieldCheck className="h-7 w-7 text-brand" />, title: 'Qualité garantie', desc: 'Produits authentiques et contrôlés' },
    { icon: <Headphones className="h-7 w-7 text-brand" />, title: 'Support client', desc: 'Disponible 7j/7 sur WhatsApp' }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Nos atouts
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Pourquoi choisir {BRAND_NAME} ?
          </h2>
          <p className="mt-2 text-ink-soft">Les avantages qui font la différence</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((adv) => (
            <div
              key={adv.title}
              className="group rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 transition group-hover:bg-brand/20">
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
// COMMENT ÇA MARCHE
// ============================================================
function HowItWorksSection() {
  const steps = [
    { step: 'Parcourez le catalogue', num: '01', desc: 'Choisissez vos articles et quantités' },
    { step: 'Prix automatique', num: '02', desc: 'Le prix de gros s\'applique selon la quantité' },
    { step: 'Validez votre panier', num: '03', desc: 'Incluez votre ville de livraison' },
    { step: 'Confirmation WhatsApp', num: '04', desc: 'Disponibilité, livraison, paiement' }
  ];

  return (
    <section id="comment-ca-marche" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card sm:p-12">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl"></div>
        <div className="relative text-center mb-10">
          <span className="inline-block rounded-full bg-gold/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
            Processus
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Comment ça marche ?
          </h2>
          <p className="text-sm text-ink-soft">En 4 étapes simples, passez votre commande</p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => (
            <li key={idx} className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white shadow-lg shadow-brand/20">
                {item.num}
              </div>
              {idx < 3 && (
                <ArrowRight
                  className="absolute right-0 top-5 hidden text-ink-soft/20 lg:block"
                  size={28}
                />
              )}
              <p className="mt-4 font-semibold text-ink">{item.step}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ============================================================
// INFOS LIVRAISON & PAIEMENT (nouveau - moderne)
// ============================================================
function DeliveryPaymentSection() {
  const zones = [
    { city: 'Douala', delay: '24h', price: '48H' },
    { city: 'Yaoundé', delay: '24-48h', price: '24H' },
    { city: 'Bafoussam / Buea', delay: '48h', price: '48H' },
    { city: 'Autres villes', delay: '48-72h', price: 'Sur devis' }
  ];
  const payments = [
    { icon: <CreditCard className="h-5 w-5" />, label: 'Mobile Money (MTN / Orange)' },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'Paiement à la livraison' },
    { icon: <ShieldCheck className="h-5 w-5" />, label: 'Virement bancaire (gros volumes)' }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Logistique
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Livraison & Paiement
          </h2>
          <p className="mt-2 text-ink-soft">Des solutions simples adaptées à votre activité</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Livraison */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">Zones de livraison</h3>
            </div>
            <ul className="mt-6 divide-y divide-ink/5">
              {zones.map((z) => (
                <li key={z.city} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{z.city}</p>
                    <p className="text-xs text-ink-soft flex items-center gap-1">
                      <Clock size={12} /> Délai : {z.delay}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand/5 px-3 py-1 text-sm font-semibold text-brand">
                    {z.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paiement */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">Moyens de paiement</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {payments.map((p) => (
                <li
                  key={p.label}
                  className="flex items-center gap-3 rounded-xl border border-ink/5 bg-gray-50 px-4 py-3"
                >
                  <span className="text-brand">{p.icon}</span>
                  <span className="text-sm font-medium text-ink">{p.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl bg-gradient-to-br from-brand/5 to-gold/5 p-4">
              <p className="text-xs text-ink-soft">
                <strong className="text-ink">Astuce :</strong> Pour les commandes de gros volumes,
                contactez-nous pour bénéficier de conditions préférentielles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA WHATSAPP
// ============================================================
function WhatsAppCTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
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
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-green-600 transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
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
// TÉMOIGNAGES
// ============================================================
function TestimonialsSection() {
  const testimonials = [
    { name: 'Marie D.', role: 'Revendeuse — Douala', text: `${BRAND_NAME} m'a permis de développer mon activité. Les prix sont imbattables !` },
    { name: 'Jean P.', role: 'Boutiquier — Yaoundé', text: 'Livraison rapide et produits de qualité. Je recommande vivement.' },
    { name: 'Paul M.', role: 'Commerçant — Bafoussam', text: 'Le service client est excellent et les prix sont très compétitifs.' }
  ];

  return (
    <section className="bg-ink text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-gold/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
            Témoignages
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold">
            Ce que disent nos clients
          </h2>
          <p className="mt-2 text-white/70">Ils nous font confiance</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((test) => (
            <div
              key={test.name}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/10"
            >
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-white/90">"{test.text}"</p>
              <div className="mt-4 border-t border-white/10 pt-4">
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
// NEWSLETTER / CONTACT (nouveau - moderne)
// ============================================================
function ContactSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-2">
          {/* Colonne infos */}
          <div className="bg-gradient-to-br from-brand to-brand-dark p-8 text-white sm:p-10">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Restons en contact</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              Une question ? Parlons-en.
            </h3>
            <p className="mt-3 text-sm text-white/80">
              Notre équipe vous répond sous 1h ouvrée pour vous conseiller sur vos achats en gros.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Phone size={16} />
                </span>
                <span className="text-sm">+237 657505924</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Mail size={16} />
                </span>
                <span className="text-sm">Pondjabrandel5@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Store size={16} />
                </span>
                <span className="text-sm">Douala · Yaoundé · Livraison nationale</span>
              </li>
            </ul>
          </div>

          {/* Colonne formulaire rapide */}
          <div className="p-8 sm:p-10">
            <h4 className="font-display text-lg font-bold text-ink">Demande rapide</h4>
            <p className="mt-1 text-sm text-ink-soft">
              Laissez votre numéro, nous vous rappelons.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const phone = e.target.phone.value.trim();
                const msg = encodeURIComponent(`Bonjour ${BRAND_NAME}, je souhaite être rappelé au ${phone}`);
                window.open(`${WHATSAPP_LINK}?text=${msg}`, '_blank');
              }}
            >
              <div>
                <label htmlFor="phone" className="text-xs font-medium text-ink-soft">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+237 6XX XX XX XX"
                  className="mt-1 w-full rounded-lg border border-ink/10 bg-gray-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <MessageCircle size={18} />
                Être rappelé sur WhatsApp
              </button>
              <p className="text-center text-xs text-ink-soft">
                En envoyant, vous serez redirigé vers WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PAGE HOME
// ============================================================
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/products', { params: { limit: 8 } })
      .then(({ data }) => {
        if (!cancelled) setProducts(data?.products ?? []);
      })
      .catch((err) => {
        console.error('Erreur chargement produits:', err);
        if (!cancelled) setError('Impossible de charger les articles.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
       <SEO
      title="Achats en gros pour revendeurs"
      description="NexTrade — Habits, chaussures, montres et accessoires au prix de gros. Commandez et négociez directement sur WhatsApp. Livraison 48h partout au Cameroun."
      url="/"
      image="/logo.png"
      keywords={[
        'grossiste Cameroun',
        'achat en gros Douala',
        'habits en gros Yaoundé',
        'chaussures en gros Cameroun',
        'revendeurs Cameroun',
        'NexTrade',
      ]}
    />
      {/* <title>Nextrade — Grossiste en ligne au Cameroun</title> */}

      <HeroCarousel />
      <TrustBar />

      {/* ===== CATÉGORIES ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Catégories
            </h2>
            <p className="text-ink-soft text-sm">Parcourez nos catégories populaires</p>
          </div>
          <Link
            to="/catalogue"
            className="text-sm font-semibold text-brand hover:underline flex items-center gap-1"
          >
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
          <Link
            to="/catalogue"
            className="text-sm font-semibold text-brand hover:underline flex items-center gap-1"
          >
            Voir tout le catalogue <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-ink/5" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>
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

      <StatsSection />
      <AdvantagesSection />
      <HowItWorksSection />
      <DeliveryPaymentSection />
      <WhatsAppCTASection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}