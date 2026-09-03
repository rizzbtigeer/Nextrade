const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/stats/dashboard (admin)
// Renvoie tout ce qu'il faut pour le tableau de bord : totaux, courbe des
// commandes sur 14 jours, répartition par statut, top articles.
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const start14 = new Date(now);
    start14.setDate(start14.getDate() - 13);
    start14.setHours(0, 0, 0, 0);

    const [totalOrders, totalProducts, totalCategories, revenueAgg, statusAgg, ordersByDayRaw, topProducts] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Order.aggregate([
          { $match: { createdAt: { $gte: start14 } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
              revenue: { $sum: '$total' }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        Product.find().sort('-clicks').limit(5).select('name clicks')
      ]);

    // Complète les jours sans commande par des valeurs à 0 (pour un graphe continu)
    const byDayMap = new Map(ordersByDayRaw.map((d) => [d._id, d]));
    const ordersByDay = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start14);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const found = byDayMap.get(key);
      ordersByDay.push({
        date: key,
        count: found ? found.count : 0,
        revenue: found ? found.revenue : 0
      });
    }

    const statusCounts = { pending: 0, confirmed: 0, cancelled: 0 };
    statusAgg.forEach((s) => {
      if (s._id in statusCounts) statusCounts[s._id] = s.count;
    });

    res.json({
      totals: {
        orders: totalOrders,
        products: totalProducts,
        categories: totalCategories,
        revenue: revenueAgg[0]?.total || 0
      },
      ordersByDay,
      statusCounts,
      topProducts: topProducts.map((p) => ({ name: p.name, clicks: p.clicks }))
    });
  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des statistiques' });
  }
};
