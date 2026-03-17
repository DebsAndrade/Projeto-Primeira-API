// array com as tarefas guardadas em memória
let tasks = [
    { id: 1, title: "Criar layout", category: "Design", nameResponsible: "João", done: false, dateConclusion: "2024-06-30" },
    { id: 2, title: "Implementar login", category: "Desenvolvimento", nameResponsible: "Maria", done: false, dateConclusion: "2024-07-05" },
    { id: 3, title: "Testar API", category: "QA", nameResponsible: "Carlos", done: false, dateConclusion: "2024-07-10" },
    { id: 4, title: "Configurar banco de dados", category: "DevOps", nameResponsible: "Ana", done: false, dateConclusion: "2024-07-15" },
    { id: 5, title: "Criar documentação", category: "Documentação", nameResponsible: "Luiza", done: false, dateConclusion: "2024-07-20" }
];

// array que guarda as relações entre tarefas e tags
let taskTags = [];

const formatDateYMD = (value = Date.now()) => {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// busca todas as tarefas com possibilidade de ordenar e filtrar
export const getAllTasks = ({ sort, search } = {}) => {
    let result = [...tasks];

    if (search) {
        const term = search.toLowerCase();
        result = result.filter((t) => t.title.toLowerCase().includes(term));
    }

    if (sort === 'asc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'desc') {
        result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
};

// busca uma tarefa pelo ID
export const getTaskById = (id) => tasks.find((task) => task.id === Number.parseInt(id, 10));

// cria uma nova tarefa
export const createTask = (title, category, nameResponsible) => {
    const newTask = {
        id: tasks.length + 1,
        title,
        category,
        nameResponsible,
        done: false,
        dateConclusion: formatDateYMD() // quero formatar esta data para YYYY-MM-DD no controller
    };
    tasks.push(newTask);
    return newTask;
};

// atualiza os dados de uma tarefa
export const updateTask = (id, updates) => {
    const taskIndex = tasks.findIndex(task => task.id === Number.parseInt(id));
    if (taskIndex === -1) {
        return null; // Tarefa não encontrada
    }

    if (updates.title !== undefined) {
        tasks[taskIndex].title = updates.title;
    }

    if (updates.category !== undefined) {
        tasks[taskIndex].category = updates.category;
    }

    if (updates.nameResponsible !== undefined) {
        tasks[taskIndex].nameResponsible = updates.nameResponsible;
    }

    if (updates.done !== undefined) {
        tasks[taskIndex].done = updates.done;
        tasks[taskIndex].dateConclusion = updates.done
            ? formatDateYMD()
            : undefined;
    }

    return tasks[taskIndex];
};

// apaga uma tarefa e as suas associações com tags
export const deleteTask = (id) => {
    const taskId = Number.parseInt(id, 10);
    const previousLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);
    taskTags = taskTags.filter((item) => item.taskId !== taskId);
    return tasks.length < previousLength;
};

// associa uma tag a uma tarefa
export const createTaskTag = (taskId, tagId) => {
    const parsedTaskId = Number.parseInt(taskId, 10);
    const parsedTagId = Number.parseInt(tagId, 10);

    const task = getTaskById(parsedTaskId);
    if (!task) {
        return { error: 'Tarefa não encontrada', status: 404 };
    }

    const alreadyExists = taskTags.some((item) => item.taskId === parsedTaskId && item.tagId === parsedTagId);
    if (alreadyExists) {
        return { error: 'Tag já associada a esta tarefa', status: 409 };
    }

    const relation = { taskId: parsedTaskId, tagId: parsedTagId };
    taskTags.push(relation);
    return { data: relation, status: 201 };
};

// remove todas as relações de uma tag quando ela é apagada
export const removeTaskTagRelationsByTagId = (tagId) => {
    const parsedTagId = Number.parseInt(tagId, 10);
    const previousLength = taskTags.length;
    taskTags = taskTags.filter((item) => item.tagId !== parsedTagId);
    return previousLength - taskTags.length;
};

// busca todas as tarefas associadas a uma tag
export const getTasksByTagId = (tagId) => {
    const parsedTagId = Number.parseInt(tagId, 10);
    const taskIds = new Set(taskTags
        .filter((item) => item.tagId === parsedTagId)
        .map((item) => item.taskId));

    return tasks.filter((task) => taskIds.has(task.id));
};

// calcula estatísticas das tarefas
export const getTaskStats = () => {
    const total = tasks.length;
    const finished = tasks.filter((t) => t.done).length;
    return {
        total,
        pending: total - finished,
        finished: finished
    };
};
