// Validar email
export function isValidEmail(email) {
    return email?.includes('@') && email.includes('.');
}

// Resposta 404 - Recurso não encontrado
export function notFound(res, message) {
    return res.status(404).json({ error: message });
}

// Resposta 500 - Erro interno do servidor
export function serverError(res, message) {
    return res.status(500).json({ error: message });
}
