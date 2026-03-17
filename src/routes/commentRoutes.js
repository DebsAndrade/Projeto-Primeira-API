import { Router } from 'express';
import { getComments, postComment } from '../controllers/commentController.js';

const router = Router();

router.get('/', getComments);
router.post('/', postComment);

export default router;
