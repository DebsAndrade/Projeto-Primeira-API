import pool from '../db.js';

// busca todos os utilizadores com filtros opcionais
export const getAllUsers = async ({ sort, search } = {}) => {
    let query = 'SELECT * FROM users';
    const params = [];

    // filtro por search no nome
    if (search) {
        query += ' WHERE name LIKE ?';
        params.push(`%${search}%`);
    }

    // ordenação
    if (sort === 'asc') {
        query += ' ORDER BY name ASC';
    } else if (sort === 'desc') {
        query += ' ORDER BY name DESC';
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

// busca um utilizador por ID
export const getUserById = async (id) => {
    const query = 'SELECT id, name, email, active, created_at FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
};

// cria um novo utilizador
export const createUser = async (name, email) => {
    const query = 'INSERT INTO users (name, email, active) VALUES (?, ?, 1)';
    const [result] = await pool.query(query, [name, email]);
    return {
        id: result.insertId,
        name,
        email,
        active: true,
        created_at: new Date().toISOString()
    };
};

// atualiza as informações de um utilizador
export const updateUser = async (id, update) => {
    let query = 'UPDATE users SET ';
    const fields = [];
    const values = [];

    if (update.name !== undefined) {
        fields.push('name = ?');
        values.push(update.name);
    }

    if (update.email !== undefined) {
        fields.push('email = ?');
        values.push(update.email);
    }

    if (update.active !== undefined) {
        fields.push('active = ?');
        values.push(update.active ? 1 : 0);
    }

    if (fields.length === 0) {
        return null;
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
        return null;
    }

    return getUserById(id);
};

// alterna o status ativo/inativo de um utilizador
export const toggleUserActive = async (id) => {
    const query = 'UPDATE users SET active = NOT active WHERE id = ?';
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return getUserById(id);
};

// remove um utilizador
export const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
};

// calcula estatísticas dos utilizadores
export const getUserStats = async () => {
    const query = `
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) as inactive
        FROM users
    `;
    const [rows] = await pool.query(query);
    const { total, active, inactive } = rows[0];
    const parsedTotal = Number(total) || 0;
    const parsedActive = Number(active) || 0;
    const parsedInactive = Number(inactive) || 0;

    return {
        total: parsedTotal,
        active: parsedActive,
        inactive: parsedInactive,
        percentageActive: parsedTotal > 0 ? Math.round((parsedActive / parsedTotal) * 100) : 0
    };
};
