const CollabRequest = require("../models/CollabRequest");
const asyncHandler = require("../middleware/asyncHandler");

const submitCollab = asyncHandler(async (req, res) => {
  const { fullName, email, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ message: "Nom, email et message sont obligatoires." });
  }
  const request = await CollabRequest.create(req.body);
  res.status(201).json({ message: "Votre demande a bien ete envoyee. Merci !", request });
});

const getAllCollabs = asyncHandler(async (req, res) => {
  const requests = await CollabRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

const updateCollabStatus = asyncHandler(async (req, res) => {
  const request = await CollabRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Demande introuvable." });
  request.status = req.body.status || request.status;
  await request.save();
  res.json(request);
});

const deleteCollab = asyncHandler(async (req, res) => {
  const request = await CollabRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Demande introuvable." });
  await request.deleteOne();
  res.json({ message: "Demande supprimee." });
});

module.exports = { submitCollab, getAllCollabs, updateCollabStatus, deleteCollab };