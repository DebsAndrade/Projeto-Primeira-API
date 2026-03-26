import { getTaskById } from '../services/taskServices.js';
import { notFound, serverError } from '../utils/helpers.js';

// middleware que valida se a tarefa da rota existe
export const checkTaskExists = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await getTaskById(taskId);

        if (!task) {
            return notFound(res, 'Tarefa não encontrada');
        }

        req.task = task;
        next();
    } catch (error) {
        console.error(error);
        return serverError(res, 'Erro ao validar tarefa');
    }
};