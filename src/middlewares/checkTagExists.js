import { getTagById } from '../services/tagServices.js';
import { notFound, serverError } from '../utils/helpers.js';

// middleware que valida se a tag da rota existe
export const checkTagExists = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const tag = await getTagById(tagId);

        if (!tag) {
            return notFound(res, 'Tag não encontrada');
        }

        req.tag = tag;
        next();
    } catch (error) {
        console.error(error);
        return serverError(res, 'Erro ao validar tag');
    }
};