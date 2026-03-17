// importa as funções de búsqueda de tarefas e utilizadores
import { getTaskById } from './taskServices.js';
import { getUserById } from './userServices.js';

// array com os comentários guardados em memória
let comments = [];

// busca comentários de uma tarefa
export const getComments = (taskId) => {
    if (!taskId) return comments;
    return comments.filter((comment) => comment.taskId === Number.parseInt(taskId, 10));
};

// busca comentários por ID da tarefa com validação
export const getCommentsByTaskId = (taskId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const task = getTaskById(parsedTaskId);

    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const taskComments = comments.filter((comment) => comment.taskId === parsedTaskId);
    return { data: taskComments, status: 200 };
};

// cria um novo comentário com validações
export const createComment = (taskId, userId, content) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedUserId = Number.parseInt(userId, 10);

    if (Number.isNaN(parsedTaskId) || Number.isNaN(parsedUserId) || !content) {
        return { error: 'taskId, userId e conteudo são obrigatórios', status: 400 };
    }

    const task = getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const user = getUserById(parsedUserId);
    if (!user) {
        return { error: 'Utilizador não encontrado', status: 404 };
    }

    const newComment = {
        id: comments.length + 1,
        taskId: parsedTaskId,
        userId: parsedUserId,
        createContent: content,
        createdDate: new Date().toISOString()
    };

    comments.push(newComment);
    return { data: newComment, status: 201 };
};
