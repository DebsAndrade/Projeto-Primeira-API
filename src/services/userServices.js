// array com os utilizadores guardados em memória
let users = [
    { id: 1, name: "Alice", email: "alice@example.com", active: true },
    { id: 2, name: "Bob", email: "bob@example.com", active: true },
    { id: 3, name: "Charlie", email: "charlie@example.com", active: true },
    { id: 4, name: "Diana", email: "diana@example.com", active: true },
    { id: 5, name: "Eve", email: "eve@example.com", active: true }
];

// busca todos os utilizadores e permite ordenar e procurar
export const getAllUsers = ({ sort, search } = {}) => {
    let result = [...users];

    if (search) {
        const term = search.toLowerCase();
        result = result.filter((u) => u.name.toLowerCase().includes(term));
    }

    if (sort === 'asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
};

// busca um utilizador por ID
export const getUserById = (id) => users.find((user) => user.id === Number.parseInt(id, 10));

// cria um novo utilizador
export const createUser = (name, email) => {
    const newUser = { id: users.length + 1, name, email, active: true };
    users.push(newUser);
    return newUser;
};

// atualiza as informações de um utilizador
export const updateUser = (id, update) => {
    const userIndex = users.findIndex((user) => user.id === Number.parseInt(id, 10));
    if (userIndex === -1) {
        return null;
    }

    if (update.name !== undefined) {
        users[userIndex].name = update.name;
    }

    if (update.email !== undefined) {
        users[userIndex].email = update.email;
    }

    if (update.active !== undefined) {
        users[userIndex].active = update.active;
    }

    return users[userIndex];
};

// alterna o status ativo/inativo de um utilizador
export const toggleUserActive = (id) => {
    const user = users.find((u) => u.id === Number.parseInt(id, 10));
    if (!user) return null;
    user.active = !user.active;
    return user;
};

// remove um utilizador do array
export const deleteUser = (id) => {
    const previousLength = users.length;
    users = users.filter((user) => user.id !== Number.parseInt(id, 10));
    return users.length < previousLength;
};

// calcula estatísticas dos utilizadores
export const getUserStats = () => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    return {
        total,
        active,
        inactive: total - active,
        percentageActive: total > 0 ? Math.round((active / total) * 100) : 0
    };
};
