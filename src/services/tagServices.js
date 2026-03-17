// array com as tags guardadas em memória
let tags = [
    { id: 1, name: 'Urgente' },
    { id: 2, name: 'Frontend' }
];

// retorna todas as tags
export const getAllTags = () => tags;

// busca uma tag pelo ID
export const getTagById = (id) => tags.find((tag) => tag.id === Number.parseInt(id, 10));

// cria uma nova tag
export const createTag = (name) => {
    const newTag = { id: tags.length + 1, name };
    tags.push(newTag);
    return newTag;
};

// apaga uma tag
export const deleteTag = (id) => {
    const parsedId = Number.parseInt(id, 10);
    const tagToDelete = getTagById(parsedId);
    if (!tagToDelete) {
        return null;
    }

    tags = tags.filter((tag) => tag.id !== parsedId);
    return tagToDelete;
};
