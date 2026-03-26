import { getUserById } from '../services/userServices.js';
import { notFound, serverError } from '../utils/helpers.js';

// middleware que valida se o utilizador da rota existe
export const checkUserExists = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) return notFound(res, 'Utilizador não encontrado');

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return serverError(res, 'Erro ao validar utilizador');
    }
};
