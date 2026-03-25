// importa o service de utilizadores
import * as userService from '../services/userServices.js';
import { getTasksByUserId } from '../services/taskServices.js';

// busca todos os utilizadores com filtros opcionais
export const getUsers = async (req, res) => {
    try {
        const { sort, search } = req.query;
        const users = await userService.getAllUsers({ sort, search });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar utilizadores' });
    }
};

// retorna estatísticas dos utilizadores
export const getUserStats = async (_, res) => {
    try {
        const stats = await userService.getUserStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao calcular estatísticas' });
    }
};

// atualiza um utilizador existente
export const updateUser = async (req, res) => {
    try {
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

        const updatedUser = await userService.updateUser(id, { name, email, active });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar utilizador' });
    }
};

// apaga um utilizador
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUser(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        res.json({ message: 'Utilizador apagado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao apagar utilizador' });
    }
};

// alterna o status ativo/inativo do utilizador
export const toggleUserActive = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.toggleUserActive(id);

        if (!user) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar utilizador' });
    }
};

// cria um novo utilizador
export const postUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'name é obrigatório' });
        }

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        const newUser = await userService.createUser(name, email);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        // Email duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email já existe' });
        }
        res.status(500).json({ error: 'Erro ao criar utilizador' });
    }
};

// lista tarefas de um utilizador
export const getUserTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const tasks = await getTasksByUserId(id);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar tarefas do utilizador' });
    }
};
