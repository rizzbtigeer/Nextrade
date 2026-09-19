import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BRAND_NAME, PRODUCTION_URL, CONTACT_EMAIL } from '../config.js';

/**
 * Composant SEO réutilisable pour toutes les pages Nextrade.
 */
export default function SEO({
  title,
  description = `${BRAND_NAME} — Habits, chaussures, montres et accessoires au prix de gros. Commandez et négociez directement sur WhatsApp. Livraison partout au Cameroun.`,
  image = '/logo.png',
  url = '/',
  type = 'website',
  product = null,
  noindex = false,
  keywords = [
    'grossiste Cameroun',
    'vente en gros Douala',
    'habits en gros Yaoundé',
    'chaussures en gros Cameroun',
    'montres en gros',
    'NexTrade',
  ],
}) {
  const fullTitle = title
    ? `${title} | ${BRAND_NAME}`
    : `${BRAND_NAME} — Achats en gros pour revendeurs`;

  const canonicalUrl = `${PRODUCTION_URL}${url}`;
  const absoluteImage = image.startsWith('http')
    ? image
    : `${PRODUCTION_URL}${image}`;

  return (
    <Helmet>
      {/* === BASIQUES === */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords?.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* === OPEN GRAPH === */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="fr_CM" />

      {/* === TWITTER CARD === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* === GÉOLOCALISATION === */}
      <meta name="geo.region" content="CM" />
      <meta name="geo.placename" content="Douala" />

      {/* === JSON-LD : ORGANISATION + WEBSITE === */}
      {!product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: BRAND_NAME,
            url: PRODUCTION_URL,
            logo: `${PRODUCTION_URL}/logo.png`,
            description,
            email: CONTACT_EMAIL,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'CM',
              addressLocality: 'Douala',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: CONTACT_EMAIL,
              availableLanguage: ['fr', 'en'],
            },
          })}
        </script>
      )}

      {/* === JSON-LD : WEBSITE (uniquement sur la home) === */}
      {url === '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: BRAND_NAME,
            url: PRODUCTION_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${PRODUCTION_URL}/catalogue?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          })}
        </script>
      )}

      {/* === JSON-LD : PRODUIT === */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || description,
            image: product.images?.[0]
              ? `${PRODUCTION_URL}${product.images[0]}`
              : absoluteImage,
            sku: product._id,
            brand: { '@type': 'Brand', name: BRAND_NAME },
            category: product.category?.name,
            offers: {
              '@type': 'Offer',
              url: canonicalUrl,
              priceCurrency: 'XAF',
              price: product.price,
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: BRAND_NAME },
            },
          })}
        </script>
      )}
    </Helmet>
  );
}