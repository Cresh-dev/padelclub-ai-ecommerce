const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato." });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Accesso negato. Richiesto ruolo amministratore." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella verifica del ruolo." });
  }
};

module.exports = adminMiddleware;
