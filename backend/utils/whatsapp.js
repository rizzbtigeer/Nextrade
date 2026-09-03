const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

// Génère un message dans le style :
// "Bonjour, . Je souhaite passer une commande en GROS :
// - Riz 50kg x 12 = 396 000 FCFA
// - Huile 5L x 30 = 210 000 FCFA
// Total commande : 606 000 FCFA. Merci de me confirmer la disponibilité et les frais de livraison pour Douala."
exports.buildWhatsAppMessage = ({ items, total, city, customerNote }) => {
  let msg = `Bonjour,. Je souhaite passer une commande en GROS :\n`;
  items.forEach((item) => {
    msg += `- ${item.name} x ${item.qty} = ${formatFCFA(item.subtotal)}\n`;
  });
  msg += `Total commande : ${formatFCFA(total)}.`;
  if (city) {
    msg += ` Merci de me confirmer la disponibilité et les frais de livraison pour ${city}.`;
  }
  if (customerNote) {
    msg += `\n${customerNote}`;
  }
  return msg;
};

exports.buildWhatsAppLink = (phoneNumber, message) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
};
