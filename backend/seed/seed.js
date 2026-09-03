require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB();

  const adminExists = await Admin.findOne({ username: 'brad@admin.com' });
  if (!adminExists) {
    await Admin.create({ username: 'brad@admin.com', password: 'eBrad237_' });
    console.log('✅ Admin créé avec succès');
  } else {
    console.log('ℹ️  Admin déjà existant, rien à faire');
  }

  let category = await Category.findOne({ slug: 'habits' });
  if (!category) {
    category = await Category.create({ name: 'Habits', slug: 'habits' });
    console.log('✅ Catégorie "Habits" créée');
  }

  const productExists = await Product.findOne({ slug: 'exemple-jean-homme' });
  if (!productExists) {
    await Product.create({
      name: 'Jean Homme',
      slug: 'exemple-jean-homme',
      description: 'Jean homme de qualité, plusieurs tailles disponibles.',
      images: [],
      category: category._id,
      priceTiers: [
        { minQty: 1, price: 8000 },
        { minQty: 10, price: 7000 },
        { minQty: 50, price: 6000 }
      ],
      moq: 1,
      stock: 200
    });
    console.log('✅ Produit exemple créé');
  }

  console.log('🌱 Seed terminé');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
