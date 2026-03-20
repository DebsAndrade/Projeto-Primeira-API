import pool from '../db.js';
// importa as funções de búsqueda de tarefas e utilizadores
import { getTaskById } from './taskServices.js';
import { getUserById } from './userServices.js';

const mapComment = (row) => ({
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at
});

// busca comentários de uma tarefa
export const getComments = async (taskId) => {
    if (!taskId) {
        const [rows] = await pool.query('SELECT id, task_id, user_id, content, created_at FROM comments ORDER BY created_at ASC');
        return rows.map(mapComment);
    }

    const [rows] = await pool.query(
        'SELECT id, task_id, user_id, content, created_at FROM comments WHERE task_id = ? ORDER BY created_at ASC',
        [taskId]
    );

    return rows.map(mapComment);
};

// busca comentários por ID da tarefa com validação
export const getCommentsByTaskId = async (taskId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const task = await getTaskById(parsedTaskId);

    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const [rows] = await pool.query(
        'SELECT id, task_id, user_id, content, created_at FROM comments WHERE task_id = ? ORDER BY created_at ASC',
        [parsedTaskId]
    );

    const taskComments = rows.map(mapComment);
    return { data: taskComments, status: 200 };
};

// cria um novo comentário com validações
export const createComment = async (taskId, userId, content) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedUserId = Number.parseInt(userId, 10);

    if (Number.isNaN(parsedTaskId) || Number.isNaN(parsedUserId) || !content) {
        return { error: 'taskId, userId e content são obrigatórios', status: 400 };
    }

    const task = await getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const user = await getUserById(parsedUserId);
    if (!user) {
        return { error: 'Utilizador não encontrado', status: 404 };
    }

    const [result] = await pool.query(
        'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
        [parsedTaskId, parsedUserId, content]
    );

    const [rows] = await pool.query(
        'SELECT id, task_id, user_id, content, created_at FROM comments WHERE id = ?',
        [result.insertId]
    );

    const newComment = mapComment(rows[0]);
    return { data: newComment, status: 201 };
};

// atualiza um comentário de uma tarefa
export const updateComment = async (taskId, commentId, content) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedCommentId = Number.parseInt(commentId, 10);

    if (Number.isNaN(parsedTaskId) || Number.isNaN(parsedCommentId) || !content) {
        return { error: 'content é obrigatório', status: 400 };
    }

    const task = await getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const [result] = await pool.query(
        'UPDATE comments SET content = ? WHERE id = ? AND task_id = ?',
        [content, parsedCommentId, parsedTaskId]
    );

    if (result.affectedRows === 0) {
        return { error: 'Comentário não encontrado', status: 404 };
    }

    const [rows] = await pool.query(
        'SELECT id, task_id, user_id, content, created_at FROM comments WHERE id = ?',
        [parsedCommentId]
    );

    return { data: mapComment(rows[0]), status: 200 };
};

// apaga um comentário de uma tarefa
export const deleteComment = async (taskId, commentId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedCommentId = Number.parseInt(commentId, 10);

    if (Number.isNaN(parsedTaskId) || Number.isNaN(parsedCommentId)) {
        return { error: 'taskId e commentId devem ser números', status: 400 };
    }

    const task = await getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const [result] = await pool.query('DELETE FROM comments WHERE id = ? AND task_id = ?', [parsedCommentId, parsedTaskId]);

    if (result.affectedRows === 0) {
        return { error: 'Comentário não encontrado', status: 404 };
    }

    return { data: true, status: 200 };
};
