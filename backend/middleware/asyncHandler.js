// Enveloppe chaque fonction de controleur asynchrone pour que toute erreur
// (validation MongoDB, erreur reseau, etc.) soit transmise a errorHandler
// au lieu de faire planter tout le serveur Node.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;