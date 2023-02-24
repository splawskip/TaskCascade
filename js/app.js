import handleThemeSwitcher from './theme-switch';
import { TodoStorage } from './todo-storage';

const Todos = new TodoStorage('todos');
handleThemeSwitcher();
