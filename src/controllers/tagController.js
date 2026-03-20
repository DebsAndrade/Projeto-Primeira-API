// importa os services
import * as tagService from '../services/tagServices.js';
import { getTasksByTagId, removeTaskTagRelationsByTagId } from '../services/taskServices.js';

// lista todas as tags
export const getTags = async (_, res) => {
    try {
        const tags = await tagService.getAllTags();
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar tags' });
    }
};

// cria uma nova tag
export const postTag = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'name é obrigatório' });
        }

        const newTag = await tagService.createTag(name);
        res.status(201).json(newTag);
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Tag já existe' });
        }
        res.status(500).json({ error: 'Erro ao criar tag' });
    }
};

// apaga uma tag
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        await removeTaskTagRelationsByTagId(id);
        const deletedTag = await tagService.deleteTag(id);

        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag não encontrada' });
        }

        res.json(deletedTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao apagar tag' });
    }
};

// lista todas as tarefas que têm uma tag específica
export const getTagTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await getTasksByTagId(id);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar tarefas da tag' });
    }
};
