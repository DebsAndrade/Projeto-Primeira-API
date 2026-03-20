import { getUserById } from '../services/userServices.js';

// middleware que valida se o utilizador da rota existe
export const checkUserExists = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao validar utilizador' });
    }
};
