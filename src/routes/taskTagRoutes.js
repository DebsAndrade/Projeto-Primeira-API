import { Router } from 'express';
import { getTaskTags, postTaskTag } from '../controllers/tagController.js';

const router = Router();

router.get('/', getTaskTags);
router.post('/', postTaskTag);

export default router;
