import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import httpCodes from '../../../utils/httpCodes/httpCodes';
import response from '../../../utils/response';
import fs from 'fs';

type Todo = {
  id: string;
  task: string;
  timestamp: string;
  isCompleted: boolean;
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const data = getTodosJson();
    return response(res, httpCodes.OK, 'Get todos success!', data);
  } catch (error: any) {
    /* istanbul ignore next */
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const createTodo = async (req: Request, res: Response) => {
  try {
    const todos = getTodosJson();

    const { task } = req.body;

    if (task == null || task == '') {
      return response(res, httpCodes.BAD_REQUEST, 'Task cannot be empty', null);
    }

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    let todoData = {
      id: uuidv4(),
      task,
      timestamp: mm + '/' + dd + '/' + yyyy,
      isCompleted: false,
    };

    todos.push(todoData);

    saveTodo(todos);

    return response(res, httpCodes.OK, 'Create todo success', todos);
  } catch (error: any) {
    /* istanbul ignore next */
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const updateTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const { task, isCompleted } = req.body;

    const todos = getTodosJson();
    const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);

    if (todoIndex === -1) {
      return response(res, httpCodes.NOT_FOUND, 'Task not found', null);
    }

    if (task == null || task == '') {
      return response(res, httpCodes.BAD_REQUEST, 'Task cannot be empty', null);
    }

    todos[todoIndex].task = task;

    if (isCompleted !== undefined) {
      todos[todoIndex].isCompleted = isCompleted;
    }

    saveTodo(todos);

    return response(res, httpCodes.OK, 'Update todo success', todos);
  } catch (error: any) {
    /* istanbul ignore next */
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const todos = getTodosJson();

    const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);

    if (todoIndex === -1) {
      return response(res, httpCodes.NOT_FOUND, 'Task not found', null);
    }

    const filteredTodos = todos.filter((todo: Todo) => todo.id !== id);

    saveTodo(filteredTodos);
    return response(res, httpCodes.OK, 'Delete todo success', null);
  } catch (error: any) {
    /* istanbul ignore next */
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const getTodosJson = () => {
  const jsonData = fs.readFileSync(
    process.cwd() + '/src/services/todo/models/todos.json',
  );
  return JSON.parse(jsonData.toString());
};

const saveTodo = (data: any) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(
    process.cwd() + '/src/services/todo/models/todos.json',
    stringifyData,
  );
};

export default { getTodos, createTodo, updateTodo, deleteTodo };
