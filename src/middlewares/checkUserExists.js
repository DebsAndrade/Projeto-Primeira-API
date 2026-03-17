import { getUserById } from '../services/userServices.js';

// middleware que valida se o utilizador da rota existe
export const checkUserExists = (req, res, next) => {
    const userId = req.params.id;
    const user = getUserById(userId);

    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });

    req.user = user;
    next();
};
