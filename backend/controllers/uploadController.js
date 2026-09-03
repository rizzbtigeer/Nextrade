// Construit l'URL publique complète d'un fichier uploadé
const buildFileUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;

// POST /api/upload/image (admin) - une seule image, champ "image"
exports.uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' });
  }
  res.status(201).json({ url: buildFileUrl(req, req.file.filename) });
};

// POST /api/upload/images (admin) - plusieurs images, champ "images"
exports.uploadMultiple = (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ message: 'Aucun fichier reçu' });
  }
  const urls = req.files.map((file) => buildFileUrl(req, file.filename));
  res.status(201).json({ urls });
};
