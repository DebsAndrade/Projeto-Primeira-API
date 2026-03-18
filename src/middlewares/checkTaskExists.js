import { getTaskById } from '../services/taskServices.js';

// middleware que valida se a tarefa da rota existe
export const checkTaskExists = (req, res, next) => {
    const taskId = req.params.id;
    const task = getTaskById(taskId);

    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    req.task = task;
    next();
};