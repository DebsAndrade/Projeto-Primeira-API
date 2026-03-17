// importa express router e os controllers
import { Router } from 'express';
import {
	getTasks,
	getTaskStats,
	postTask,
	updateTask,
	deleteTask,
	postTaskTag,
	postTaskComment,
	getTaskComments
} from '../controllers/taskController.js';
import { checkTaskExists } from '../middlewares/checkTaskExists.js';

// cria o router
const router = Router();

// rotas de tarefas
router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.post('/', postTask);
router.put('/:id', checkTaskExists, updateTask);
router.delete('/:id', checkTaskExists, deleteTask);
// rotas de tags e comentários dentro de tarefas
router.post('/:id/tags', checkTaskExists, postTaskTag);
router.post('/:id/comments', checkTaskExists, postTaskComment);
router.get('/:id/comments', checkTaskExists, getTaskComments);

export default router;
