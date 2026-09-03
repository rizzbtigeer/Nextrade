// controllers/authController.js
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  const admin = await Admin.findOne({ username });

  // Message volontairement identique que l'utilisateur existe ou non
  // (évite de révéler quels comptes existent à un attaquant)
  if (!admin) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  if (admin.isLocked()) {
    const minutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
    return res.status(423).json({
      message: `Compte temporairement verrouillé suite à plusieurs échecs. Réessayez dans ${minutes} min.`
    });
  }

  const valid = await admin.comparePassword(password);
  if (!valid) {
    await admin.registerFailedLogin();
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  await admin.registerSuccessfulLogin();

  res.json({
    _id: admin._id,
    username: admin.username,
    role: admin.role,
    token: generateToken(admin._id)
  });
};

// POST /api/auth/create-admin (protégé : un admin connecté peut en créer un autre)
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }
  const exists = await Admin.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
  }
  const admin = await Admin.create({ username, password });
  res.status(201).json({ _id: admin._id, username: admin.username });
};

// ===== NOUVELLES FONCTIONS À AJOUTER =====

// GET /api/auth/admins - Liste tous les administrateurs
exports.getAdmins = async (req, res) => {
  try {
    // Récupérer tous les admins sans les mots de passe
    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des administrateurs' });
  }
};

// PUT /api/auth/admins/:id - Modifier un administrateur
exports.updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminId = req.params.id;

    // Vérifier si l'admin existe
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    // Mettre à jour le username si fourni
    if (username) {
      // Vérifier si le nouveau username existe déjà (sauf pour l'admin actuel)
      const existing = await Admin.findOne({ 
        username: username, 
        _id: { $ne: adminId } 
      });
      if (existing) {
        return res.status(400).json({ 
          message: 'Ce nom d\'utilisateur existe déjà' 
        });
      }
      admin.username = username;
    }

    // Mettre à jour le mot de passe si fourni
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ 
          message: 'Le mot de passe doit contenir au moins 6 caractères' 
        });
      }
      admin.password = password;
    }

    await admin.save();

    // Retourner l'admin sans le mot de passe
    const updatedAdmin = await Admin.findById(adminId).select('-password');
    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};

// DELETE /api/auth/admins/:id - Supprimer un administrateur
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Vérifier si l'admin existe
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    // Vérifier si l'utilisateur connecté est admin
    const currentAdmin = await Admin.findById(req.admin._id);
    if (!currentAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Empêcher de se supprimer soi-même
    if (currentAdmin._id.toString() === adminId) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }

    await Admin.findByIdAndDelete(adminId);
    res.json({ message: 'Administrateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};