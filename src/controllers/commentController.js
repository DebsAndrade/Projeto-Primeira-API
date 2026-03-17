// importa os services
import * as commentService from '../services/commentServices.js';
import { getTaskById } from '../services/taskServices.js';
import { getUserById } from '../services/userServices.js';

// busca comentários de uma tarefa
export const getComments = (req, res) => {
    const { taskId } = req.query;
    res.json(commentService.getComments(taskId));
};

// cria um novo comentário
export const postComment = (req, res) => {
    const { taskId, userId, content, creationDate } = req.body;

    if (taskId === undefined || userId === undefined || !content) {
        return res.status(400).json({ error: 'taskId, userId e content são obrigatórios' });
    }

    const task = getTaskById(taskId);
    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const user = getUserById(userId);
    if (!user) {
        return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const newComment = commentService.createComment(taskId, userId, content, creationDate);
    res.status(201).json(newComment);
};
