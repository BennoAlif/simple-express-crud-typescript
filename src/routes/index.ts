import { Router } from 'express';
import todoService from '../services/todo/routes';

const router = Router();

router.use('/todos', todoService);

export default router;
