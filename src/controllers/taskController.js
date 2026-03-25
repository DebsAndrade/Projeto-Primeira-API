// importa os services
import * as taskService from '../services/taskServices.js';
import * as tagService from '../services/tagServices.js';
import * as commentService from '../services/commentServices.js';

const sendServiceError = (res, result) => {
    if (result?.error) {
        res.status(result.status).json({ error: result.error });
        return true;
    }

    return false;
};

const validateTaskCreationPayload = ({ title, category, userId }) => {
    if (!title) {
        return 'O título é obrigatório';
    }

    if (title.length < 3) {
        return 'title deve ter pelo menos 3 caracteres';
    }

    if (!category) {
        return 'A categoria é obrigatória';
    }

    if (userId === undefined) {
        return 'userId é obrigatório';
    }

    return null;
};

const validateTaskUpdatePayload = ({ title, done, category, userId, dateConclusion }) => {
    if (title === undefined && done === undefined && category === undefined && userId === undefined && dateConclusion === undefined) {
        return 'Envie ao menos um campo para atualização';
    }

    if (title !== undefined && typeof title !== 'string') {
        return 'title deve ser texto';
    }

    if (done !== undefined && typeof done !== 'boolean') {
        return 'done deve ser boolean';
    }

    if (category !== undefined && typeof category !== 'string') {
        return 'category deve ser texto';
    }

    return null;
};

// busca todas as tarefas com possibilidade de filtrar e ordenar
export const getTasks = async (req, res) => {
    try {
        const { sort, search } = req.query;
        const allTasks = await taskService.getAllTasks({ sort, search });
        res.json(allTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
};

// retorna número de tarefas concluídas e pendentes
export const getTaskStats = async (_, res) => {
    try {
        const stats = await taskService.getTaskStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao calcular estatísticas de tarefas' });
    }
};

// atualiza uma tarefa
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const validationError = validateTaskUpdatePayload(payload);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const updatedTask = await taskService.updateTask(id, payload);

        if (!updatedTask) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        if (sendServiceError(res, updatedTask)) {
            return;
        }

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
};

// apaga uma tarefa
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await taskService.deleteTask(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
};

// cria uma nova tarefa
export const postTask = async (req, res) => {
    try {
        const { title, category, userId } = req.body;
        const validationError = validateTaskCreationPayload({ title, category, userId });
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const result = await taskService.createTask(title, category, userId);

        if (sendServiceError(res, result)) {
            return;
        }

        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
};

// associa uma tag a uma tarefa
export const postTaskTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { tagId } = req.body;

        if (tagId === undefined) {
            return res.status(400).json({ error: 'tagId é obrigatório' });
        }

        const tag = await tagService.getTagById(tagId);
        if (!tag) {
            return res.status(404).json({ error: 'Tag não encontrada' });
        }

        const result = await taskService.createTaskTag(id, tagId);
        if (sendServiceError(res, result)) {
            return;
        }

        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao associar tag à tarefa' });
    }
};

// cria um comentário numa tarefa
export const postTaskComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;
        const result = await commentService.createComment(id, userId, content);
        if (sendServiceError(res, result)) {
            return;
        }

        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
};

// lista todos os comentários de uma tarefa
export const getTaskComments = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentService.getCommentsByTaskId(id);

        if (sendServiceError(res, result)) {
            return;
        }

        res.json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar comentários' });
    }
};

// atualiza um comentário numa tarefa
export const putTaskComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { content } = req.body;

        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'content é obrigatório' });
        }

        const result = await commentService.updateComment(id, commentId, content);
        if (sendServiceError(res, result)) {
            return;
        }

        res.json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
};

// apaga um comentário numa tarefa
export const deleteTaskComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const result = await commentService.deleteComment(id, commentId);

        if (sendServiceError(res, result)) {
            return;
        }

        res.json({ message: 'Comentário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
};
