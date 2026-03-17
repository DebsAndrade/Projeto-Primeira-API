// importa os services
import * as tagService from '../services/tagServices.js';
import { getTasksByTagId, removeTaskTagRelationsByTagId } from '../services/taskServices.js';

// lista todas as tags
export const getTags = (_, res) => {
    res.json(tagService.getAllTags());
};

// cria uma nova tag
export const postTag = (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'name é obrigatório' });
    }

    const newTag = tagService.createTag(name);
    res.status(201).json(newTag);
};

// apaga uma tag
export const deleteTag = (req, res) => {
    const { id } = req.params;
    const deletedTag = tagService.deleteTag(id);

    removeTaskTagRelationsByTagId(id);

    res.json(deletedTag);
};

// lista todas as tarefas que têm uma tag específica
export const getTagTasks = (req, res) => {
    const { id } = req.params;
    const tasks = getTasksByTagId(id);
    res.json(tasks);
};
