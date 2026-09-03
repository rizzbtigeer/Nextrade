// controllers/categoryController.js
const Category = require('../models/Category');
const slugify = require('../utils/slugify');

// GET /api/categories (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des catégories' });
  }
};

// GET /api/categories/:id (public) - Récupérer une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement de la catégorie' });
  }
};

// GET /api/categories/slug/:slug (public) - Récupérer une catégorie par slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement de la catégorie' });
  }
};

// POST /api/categories (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const trimmedName = name.trim();
    
    // Vérifier si la catégorie existe déjà (cas insensible)
    const exists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }

    const slug = slugify(trimmedName);
    
    // Vérifier si le slug existe déjà (au cas où)
    let finalSlug = slug;
    let counter = 1;
    while (await Category.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const category = await Category.create({ 
      name: trimmedName, 
      slug: finalSlug 
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
  }
};

// PUT /api/categories/:id (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    // Vérifier si la catégorie existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const trimmedName = name.trim();
    
    // Vérifier si une autre catégorie a déjà ce nom
    const exists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      _id: { $ne: categoryId }
    });
    
    if (exists) {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }

    const slug = slugify(trimmedName);
    
    // Vérifier si le slug existe déjà (pour une autre catégorie)
    let finalSlug = slug;
    let counter = 1;
    while (await Category.findOne({ slug: finalSlug, _id: { $ne: categoryId } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    category.name = trimmedName;
    category.slug = finalSlug;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de la catégorie' });
  }
};

// DELETE /api/categories/:id (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Vérifier si la catégorie existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    // Vérifier si des produits utilisent cette catégorie
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ category: categoryId });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `Impossible de supprimer cette catégorie car elle est utilisée par ${productsCount} produit(s)` 
      });
    }

    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
  }
};

// DELETE /api/categories (admin) - Supprimer plusieurs catégories
exports.deleteMultipleCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Aucune catégorie sélectionnée' });
    }

    // Vérifier si des produits utilisent ces catégories
    const Product = require('../models/Product');
    const productsUsing = await Product.find({ category: { $in: ids } });
    
    if (productsUsing.length > 0) {
      const categoryNames = productsUsing.map(p => p.category.name).filter((v, i, a) => a.indexOf(v) === i);
      return res.status(400).json({ 
        message: `Impossible de supprimer les catégories utilisées par des produits: ${categoryNames.join(', ')}` 
      });
    }

    const result = await Category.deleteMany({ _id: { $in: ids } });
    res.json({ 
      message: `${result.deletedCount} catégorie(s) supprimée(s) avec succès` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des catégories' });
  }
};