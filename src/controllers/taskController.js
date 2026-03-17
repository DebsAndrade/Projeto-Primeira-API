// importa os services
import * as taskService from '../services/taskServices.js';
import * as tagService from '../services/tagServices.js';
import * as commentService from '../services/commentServices.js';

// busca todas as tarefas com possibilidade de filtrar e ordenar
export const getTasks = (req, res) => {
    const { sort, search } = req.query;
    const allTasks = taskService.getAllTasks({ sort, search });
    res.json(allTasks);
};

// retorna número de tarefas concluídas e pendentes
export const getTaskStats = (_, res) => {
    const stats = taskService.getTaskStats();
    res.json(stats);
};

// atualiza uma tarefa
export const updateTask = (req, res) => {
    const { id } = req.params;
    const { title, done, category, nameResponsible, dateConclusion } = req.body;

    if (title === undefined && done === undefined && category === undefined && nameResponsible === undefined && dateConclusion === undefined) {
        return res.status(400).json({ message: "Envie ao menos um campo para atualização" });
    }

    if (title !== undefined && typeof title !== 'string') {
        return res.status(400).json({ message: "title deve ser texto" });
    }

    if (done !== undefined && typeof done !== 'boolean') {
        return res.status(400).json({ message: "done deve ser boolean" });
    }

    const updatedTask = taskService.updateTask(id, { title, done, category, nameResponsible, dateConclusion });
    res.json(updatedTask);
};

// apaga uma tarefa
export const deleteTask = (req, res) => {
    const { id } = req.params;
    taskService.deleteTask(id);
    res.json({ message: "Tarefa deletada com sucesso" });
};

// cria uma nova tarefa
export const postTask = (req, res) => {
    const { title, category, nameResponsible } = req.body;

    if (!title) {
        return res.status(400).json({ message: "O título é obrigatório" });
    }

    if (title.length < 3) {
        return res.status(400).json({ message: "title deve ter pelo menos 3 caracteres" });
    }

    if (!category) {
        return res.status(400).json({ message: "A categoria é obrigatória" });
    }

    if (!nameResponsible) {
        return res.status(400).json({ message: "O responsável é obrigatório" });
    }

    const newTask = taskService.createTask(title, category, nameResponsible);
    res.status(201).json(newTask);
};

// associa uma tag a uma tarefa
export const postTaskTag = (req, res) => {
    const { id } = req.params;
    const { tagId } = req.body;

    if (tagId === undefined) {
        return res.status(400).json({ error: 'tagId é obrigatório' });
    }

    const tag = tagService.getTagById(tagId);
    if (!tag) {
        return res.status(404).json({ error: 'Tag não encontrada' });
    }

    const result = taskService.createTaskTag(id, tagId);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    res.status(result.status).json(result.data);
};

// cria um comentário numa tarefa
export const postTaskComment = (req, res) => {
    const { id } = req.params;
    const { userId, createContent, content } = req.body;

    const result = commentService.createComment(id, userId, createContent ?? content);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    res.status(result.status).json(result.data);
};

// lista todos os comentários de uma tarefa
export const getTaskComments = (req, res) => {
    const { id } = req.params;
    const result = commentService.getCommentsByTaskId(id);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    res.json(result.data);
};
