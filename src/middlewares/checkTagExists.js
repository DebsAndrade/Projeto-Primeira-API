import { getTagById } from '../services/tagServices.js';

// middleware que valida se a tag da rota existe
export const checkTagExists = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const tag = await getTagById(tagId);

        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada' });
        }

        req.tag = tag;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao validar tag' });
    }
};