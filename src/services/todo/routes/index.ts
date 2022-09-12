import { Router } from 'express';
import todos from '../controllers/TodoController';

const router = Router();

router.get('/', todos.getTodos);
router.post('/', todos.createTodo);
router.put('/:id', todos.updateTodo);
router.delete('/:id', todos.deleteTodo);

export default router;
