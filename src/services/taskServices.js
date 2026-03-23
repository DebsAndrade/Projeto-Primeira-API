import pool from '../db.js';
import { getUserById } from './userServices.js';

// busca todas as tarefas com possibilidade de ordenar e filtrar
export const getAllTasks = async ({ sort, search } = {}) => {
    let query = 'SELECT * FROM tasks';
    const params = [];

    if (search) {
        query += ' WHERE title LIKE ?';
        params.push(`%${search}%`);
    }

    if (sort === 'asc') {
        query += ' ORDER BY title ASC';
    } else if (sort === 'desc') {
        query += ' ORDER BY title DESC';
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

// busca uma tarefa pelo ID
export const getTaskById = async (id) => {
    const parsedId = Number.parseInt(id, 10);
    if (Number.isNaN(parsedId)) {
        return null;
    }

    const [rows] = await pool.query(
        'SELECT id, title, category, done, date_conclusion, user_id, created_at FROM tasks WHERE id = ?',
        [parsedId]
    );

    return rows[0] || null;
};

// cria uma nova tarefa
export const createTask = async (title, category, userId) => {
    const parsedUserId = Number.parseInt(userId, 10);

    if (Number.isNaN(parsedUserId)) {
        return { error: 'userId é obrigatório e deve ser número', status: 400 };
    }

    const user = await getUserById(parsedUserId);
    if (!user) {
        return { error: 'Utilizador não encontrado', status: 404 };
    }

    const [result] = await pool.query(
        'INSERT INTO tasks (title, category, done, date_conclusion, user_id) VALUES (?, ?, 0, NULL, ?)',
        [title, category, parsedUserId]
    );

    const newTask = await getTaskById(result.insertId);
    return { data: newTask, status: 201 };
};

// atualiza os dados de uma tarefa
export const updateTask = async (id, updates) => {
    let query = 'UPDATE tasks SET ';
    const fields = [];
    const values = [];
    const hasDateConclusion = updates.dateConclusion !== undefined;

    const simpleUpdates = [
        { enabled: updates.title !== undefined, field: 'title = ?', value: updates.title },
        { enabled: updates.category !== undefined, field: 'category = ?', value: updates.category },
        {
            enabled: hasDateConclusion,
            field: 'date_conclusion = ?',
            value: hasDateConclusion ? updates.dateConclusion || null : undefined
        }
    ];

    for (const update of simpleUpdates) {
        if (!update.enabled) {
            continue;
        }

        fields.push(update.field);
        values.push(update.value);
    }

    if (updates.done !== undefined) {
        fields.push('done = ?');
        values.push(updates.done ? 1 : 0);

        if (!hasDateConclusion) {
            fields.push(updates.done ? 'date_conclusion = CURDATE()' : 'date_conclusion = NULL');
        }
    }

    if (updates.userId !== undefined) {
        const parsedUserId = Number.parseInt(updates.userId, 10);

        if (Number.isNaN(parsedUserId)) {
            return { error: 'userId deve ser número', status: 400 };
        }

        const user = await getUserById(parsedUserId);
        if (!user) {
            return { error: 'Utilizador não encontrado', status: 404 };
        }

        fields.push('user_id = ?');
        values.push(parsedUserId);
    }

    if (fields.length === 0) {
        return { error: 'Envie ao menos um campo para atualização', status: 400 };
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
        return null;
    }

    return await getTaskById(id);
};

// apaga uma tarefa e as suas associações com tags/comentários
export const deleteTask = async (id) => {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// associa uma tag a uma tarefa
export const createTaskTag = async (taskId, tagId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedTagId = Number.parseInt(tagId, 10);

    if (Number.isNaN(parsedTaskId) || Number.isNaN(parsedTagId)) {
        return { error: 'taskId e tagId devem ser números', status: 400 };
    }

    const task = await getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    try {
        await pool.query('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)', [parsedTaskId, parsedTagId]);
        return { data: { taskId: parsedTaskId, tagId: parsedTagId }, status: 201 };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { error: 'Tag já associada a esta tarefa', status: 409 };
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return { error: 'Tag não encontrada', status: 404 };
        }

        throw error;
    }
};

// remove todas as relações de uma tag quando ela é apagada
export const removeTaskTagRelationsByTagId = async (tagId) => {
    const [result] = await pool.query('DELETE FROM task_tags WHERE tag_id = ?', [tagId]);
    return result.affectedRows;
};

// busca todas as tarefas associadas a uma tag
export const getTasksByTagId = async (tagId) => {
    const [rows] = await pool.query(
        `SELECT t.id, t.title, t.category, t.done, t.date_conclusion, t.user_id, t.created_at
         FROM tasks t
         INNER JOIN task_tags tt ON tt.task_id = t.id
         WHERE tt.tag_id = ?
         ORDER BY t.id ASC`,
        [tagId]
    );

    return rows;
};

// busca tarefas de um utilizador
export const getTasksByUserId = async (userId) => {
    const [rows] = await pool.query(
        'SELECT id, title, category, done, date_conclusion, user_id, created_at FROM tasks WHERE user_id = ? ORDER BY id ASC',
        [userId]
    );

    return rows;
};

// calcula estatísticas das tarefas
export const getTaskStats = async () => {
    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) AS finished
         FROM tasks`
    );

    const total = Number(rows[0].total) || 0;
    const finished = Number(rows[0].finished) || 0;

    return {
        total,
        pending: total - finished,
        finished
    };
};
