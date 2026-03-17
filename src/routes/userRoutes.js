// importa express router e os controllers
import { Router } from 'express';
import { getUsers, getUserStats, postUser, updateUser, toggleUserActive, deleteUser } from '../controllers/userController.js';
import { checkUserExists } from '../middlewares/checkUserExists.js';

// cria o router
const router = Router();

// rotas de utilizadores
router.get('/stats', getUserStats);
router.get('/', getUsers);
router.post('/', postUser);
router.put('/:id', checkUserExists, updateUser);
router.patch('/:id', checkUserExists, toggleUserActive);
router.delete('/:id', checkUserExists, deleteUser);

export default router;
