import { getTaskById } from '../services/taskServices.js';

// middleware que valida se a tarefa da rota existe
export const checkTaskExists = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await getTaskById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        req.task = task;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao validar tarefa' });
    }
};