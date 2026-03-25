// importa express pra criar a API
import express from 'express';
// importa cors pra permitir requisições de outros domínios (útil pro frontend)
import cors from 'cors';
// importa as rotas de utilizadores, tarefas e tags
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
// importa o middleware de log
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

// cria a aplicação express
const app = express();

// ativa o CORS pra permitir requisições de outros domínios (útil pro frontend)
app.use(cors(
    {
        origin: "http://localhost:5173"  // Só permite seu frontend
    }
));

// middleware pra aceitar JSON
app.use(express.json());
// middleware pra registar requests
app.use(loggerMiddleware);

// registra as rotas com os seus paths
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);

// pega a porta da variável de ambiente ou usa 3000 por padrão
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Servidor a correr em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar no MySQL:', error.message);
        process.exit(1);
    }
};

startServer();
