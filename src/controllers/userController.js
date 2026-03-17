// importa o service de utilizadores
import * as userService from '../services/userServices.js';

// busca todos os utilizadores com filtros opcionais
export const getUsers = (req, res) => {
    const { sort, search } = req.query;
    const users = userService.getAllUsers({ sort, search });
    res.json(users);
};

// retorna estatísticas dos utilizadores
export const getUserStats = (_, res) => {
    const stats = userService.getUserStats();
    res.json(stats);
};

// atualiza um utilizador existente
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, active } = req.body;

    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ error: 'name deve ser texto' });
    }

    if (email !== undefined) {
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ error: 'Email inválido' });
        }
    }

    if (active !== undefined) {
        if (typeof active !== 'boolean') {
            return res.status(400).json({ error: 'active deve ser boolean' });
        }
    }

    const updatedUser = userService.updateUser(id, { name, email, active });
    res.json(updatedUser);
};

// apaga um utilizador
export const deleteUser = (req, res) => {
    const { id } = req.params;
    userService.deleteUser(id);
    res.json({ message: 'Utilizador apagado com sucesso' });
};

// alterna o status ativo/inativo do utilizador
export const toggleUserActive = (req, res) => {
    const { id } = req.params;
    const user = userService.toggleUserActive(id);
    res.json(user);
};

// cria um novo utilizador
export const postUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'name é obrigatório' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido' });
    }

    const newUser = userService.createUser(name, email);
    res.status(201).json(newUser);
};
