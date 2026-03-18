import { getTagById } from '../services/tagServices.js';

// middleware que valida se a tag da rota existe
export const checkTagExists = (req, res, next) => {
    const tagId = req.params.id;
    const tag = getTagById(tagId);

    if (!tag) {
        return res.status(404).json({ error: 'Tag não encontrada' });
    }

    req.tag = tag;
    next();
};