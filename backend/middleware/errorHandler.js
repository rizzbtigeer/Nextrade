exports.notFound = (req, res, next) => {
  res.status(404).json({ message: `Route non trouvée - ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  // Messages plus clairs pour les erreurs d'upload (Multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image trop lourde (5 Mo maximum)' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: "Trop d'images envoyées à la fois" });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
