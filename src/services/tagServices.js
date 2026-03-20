import pool from '../db.js';

const mapTag = (row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at
});

// retorna todas as tags
export const getAllTags = async () => {
    const [rows] = await pool.query('SELECT id, name, created_at FROM tags ORDER BY id ASC');
    return rows.map(mapTag);
};

// busca uma tag pelo ID
export const getTagById = async (id) => {
    const [rows] = await pool.query('SELECT id, name, created_at FROM tags WHERE id = ?', [id]);
    return rows[0] ? mapTag(rows[0]) : null;
};

// cria uma nova tag
export const createTag = async (name) => {
    const [result] = await pool.query('INSERT INTO tags (name) VALUES (?)', [name]);
    return await getTagById(result.insertId);
};

// apaga uma tag
export const deleteTag = async (id) => {
    const tagToDelete = await getTagById(id);
    if (!tagToDelete) {
        return null;
    }

    await pool.query('DELETE FROM tags WHERE id = ?', [id]);
    return tagToDelete;
};
