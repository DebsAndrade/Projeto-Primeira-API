// importa express router e os controllers
import { Router } from 'express';
import { getTags, postTag, deleteTag, getTagTasks } from '../controllers/tagController.js';
import { checkTagExists } from '../middlewares/checkTagExists.js';

// cria o router
const router = Router();

// rotas de tags
router.get('/', getTags);
router.post('/', postTag);
router.delete('/:id', checkTagExists, deleteTag);
router.get('/:id/tasks', checkTagExists, getTagTasks);

export default router;
