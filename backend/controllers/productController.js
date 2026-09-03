const Product = require('../models/Product');
const slugify = require('../utils/slugify');

// GET /api/products (public) - catalogue avec filtre catégorie/recherche + pagination
exports.getProducts = async (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  const filter = { available: true };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// GET /api/products/:slug (public) - fiche produit
exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Article non trouvé' });
  res.json(product);
};

// POST /api/products/:id/click (public) - pour les statistiques de visibilité par article
exports.trackClick = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Article non trouvé' });
  res.json({ clicks: product.clicks });
};

// GET /api/products/admin/all (admin) - liste complète, y compris indisponibles
exports.getAdminProducts = async (req, res) => {
  const products = await Product.find().populate('category', 'name').sort('-createdAt');
  res.json(products);
};

// POST /api/products (admin)
exports.createProduct = async (req, res) => {
  const { name, description, images, category, priceTiers, moq, stock, available } = req.body;
  if (!name || !category || !priceTiers?.length) {
    return res.status(400).json({ message: 'Nom, catégorie et au moins un palier de prix sont requis' });
  }
  const product = await Product.create({
    name,
    description,
    images,
    category,
    priceTiers,
    moq,
    stock,
    available,
    slug: `${slugify(name)}-${Date.now().toString(36)}`
  });
  res.status(201).json(product);
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) return res.status(404).json({ message: 'Article non trouvé' });
  res.json(product);
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Article non trouvé' });
  res.json({ message: 'Article supprimé' });
};
