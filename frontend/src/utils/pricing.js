// Reproduit côté client la même logique que le backend (models/Product.js)
// pour un affichage instantané ; le prix final est toujours revérifié côté serveur.
export function getPriceForQty(priceTiers, qty) {
  if (!priceTiers?.length) return 0;
  const sorted = [...priceTiers].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find((t) => qty >= t.minQty);
  return tier ? tier.price : sorted[sorted.length - 1].price;
}

export function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' FCFA';
}

export function lowestTierPrice(priceTiers) {
  if (!priceTiers?.length) return 0;
  return Math.min(...priceTiers.map((t) => t.price));
}

export function highestTierPrice(priceTiers) {
  if (!priceTiers?.length) return 0;
  return Math.max(...priceTiers.map((t) => t.price));
}
