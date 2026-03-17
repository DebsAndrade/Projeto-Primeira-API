// middleware que registra todas as requisições
export const loggerMiddleware = (req, _, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
};
