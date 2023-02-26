import {
  generateUUIDv4,
  getURLHash,
  delegateEvent,
  insertHTML,
  replaceHTML,
} from './utils';

import handleThemeSwitcher from './theme-switch';
import { TodoStorage } from './todo-storage';

const Todos = new TodoStorage('todos');

const App = {
  selectors: {
    // DOM Elements.
    input: document.querySelector('[data-todo="new"]'),
    clear: document.querySelector('[data-todo="clear-completed"]'),
    list: document.querySelector('[data-todo="list"]'),
    footer: document.querySelector('[data-todo="footer"]'),
    counter: document.querySelector('[data-todo="count"]'),
    // Manipulation methods on DOM Elements.
    showList(show) {
      App.selectors.list.style.display = show ? 'block' : 'none';
    },
    showFooter(show) {
      App.selectors.footer.style.display = show ? 'flex' : 'none';
    },
    showClear(show) {
      App.selectors.clear.style.display = show ? 'block' : 'none';
    },
    showCounter(count) {
      replaceHTML(
        App.selectors.counter,
        `
			<strong>${count}</strong> ${count > 1 ? 'items' : 'item'} left</span>
		`
      );
    },
    setActiveFilter(filter) {
      document.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
        if (el.matches(`[href="#/${filter}"]`)) {
          el.classList.add('text-blue-700');
        } else {
          el.classList.remove('text-blue-700');
        }
      });
    },
  },
  addTodo() {
    App.selectors.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && e.target.value.length) {
        Todos.add({
          id: generateUUIDv4(),
          title: e.target.value,
          completed: false,
        });
        App.selectors.input.value = '';
        App.render();
      }
    });
  },
  createTodoItem(todo) {
    // Create li element representing single todo item.
    const li = document.createElement('li');
    // Apply Tailwind styles to it.
    li.classList.add(
      'relative',
      'bg-white',
      'px-6',
      'py-5',
      'border-b',
      'border-slate-300',
      'dark:bg-ebony'
    );
    // Set id of the todo item on the element.
    li.dataset.id = todo.id;
    // Insert additional HTML into Li element.
    insertHTML(
      li,
      `
		  <div class="view flex flex-row justify-start items-center flex-nowrap">
			  <input class="toggle relative mr-8 appearance-none w-6 h-6 border border-solid cursor-pointer border-snuff rounded-full bg-transparent checked:bg-gradient checked:border-transparent before:content-[''] before:absolute before:inset-0 before:text-white before:text-md before:text-center before:w-full checked:before:content-['\\2713']" data-todo="toggle" type="checkbox"
				  ${todo.completed ? 'checked' : ''}>
			  <label class="text-lg ${
          todo.completed ? 'line-through' : false
        }" data-todo="label">${todo.title}</label>
			  <button class="destroy ml-auto" data-todo="remove">X</button>
		  </div>
		  <input class="edit hidden" data-todo="edit">
	  `
    );
    li.querySelector('[data-todo="edit"]').value = todo.title;
    // Return node.
    return li;
  },
  /**
   * Delegate event to the desired Todo item.
   *
   * @param {String} event - String that represents name of the event.
   * @param {String} selector - String that represents valid CSS selector.
   * @param {Function} handler - Callback function that we want to run on event.
   */
  todoEvent(event, selector, handler) {
    delegateEvent(App.selectors.list, selector, event, (e) => {
      const el = e.target.closest('[data-id]');
      handler(Todos.get(el.dataset.id), el, e);
    });
  },
  bindEvents() {
    // Handle removal of the Todo item.
    App.todoEvent('click', '[data-todo="remove"]', (todo) => {
      Todos.remove(todo);
    });
    // Handle toggling completed state of the Todo item.
    App.todoEvent('click', '[data-todo="toggle"]', (todo) =>
      Todos.toggle(todo)
    );
    App.addTodo();
  },
  init() {
    handleThemeSwitcher();
    /**
     * Since TodoStorage class extends EventTarget we can attach and run events on it.
     * Every change in TodoStorage will trigger the re-render of the list.
     * */
    Todos.addEventListener('save', App.render);
    App.filter = getURLHash();
    window.addEventListener('hashchange', () => {
      App.filter = getURLHash();
      App.render();
    });
    App.bindEvents();
    App.render();
  },
  render() {
    const count = Todos.getFiltered('all').length;
    App.selectors.list.replaceChildren(
      ...Todos.getFiltered(App.filter).map((todo) => App.createTodoItem(todo))
    );
    App.selectors.showList(count);
    App.selectors.showFooter(count);
    App.selectors.showClear(Todos.hasCompleted());
    App.selectors.showCounter(Todos.getFiltered('active').length);
    App.selectors.setActiveFilter(App.filter);
  },
};
App.init();
