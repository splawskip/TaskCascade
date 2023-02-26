import {
  delegateEvent,
  generateUUIDv4,
  getURLHash,
  insertHTML,
  replaceHTML,
} from './utils';
import handleThemeSwitcher from './theme-switch';
import { TodoStorage } from './todo-storage';

// Init Todo Storage.
const Todos = new TodoStorage('todos');

// Build the App.
const App = {
  // DOM elements that the App "knows".
  selectors: {
    input: document.querySelector('[data-todo="new"]'),
    list: document.querySelector('[data-todo="list"]'),
    footer: document.querySelector('[data-todo="footer"]'),
    counter: document.querySelector('[data-todo="count"]'),
    filters: document.querySelectorAll('[data-todo="filters"] a'),
    clear: document.querySelector('[data-todo="clear-completed"]'),
  },
  /**
   * "Sets" currently active fillter by applying some style.
   *
   * @param {String} filter - Value from getURLHash function.
   */
  setActiveFilter(filter) {
    App.selectors.filters.forEach((element) => {
      if (element.matches(`[href="#/${filter}"]`)) {
        element.classList.add('text-blue-500');
      } else {
        element.classList.remove('text-blue-500');
      }
    });
  },
  /**
   * Decides if "Clear completed" button should be visible.
   *
   * @param {Number|Bool} show - Tells if component should be visible.
   */
  showList(show) {
    App.selectors.list.style.display = show ? 'block' : 'none';
  },
  /**
   * Decides if "Clear completed" button should be visible.
   *
   * @param {Number|Bool} show - Tells if component should be visible.
   */
  showFooter(show) {
    App.selectors.footer.style.display = show ? 'flex' : 'none';
  },
  /**
   * Decides if "Clear completed" button should be visible.
   *
   * @param {Number|Bool} count - Tells if component should be visible.
   */
  showCounter(count) {
    replaceHTML(
      App.selectors.counter,
      `<strong>${count}</strong> ${count === 1 ? 'item' : 'items'} left`
    );
  },
  /**
   * Decides if "Clear completed" button should be visible.
   *
   * @param {Number|Bool} show - Tells if component should be visible.
   */
  showClear(show) {
    App.selectors.clear.style.display = show ? 'block' : 'none';
  },
  /**
   * Adds new Todo item to the storage.
   */
  addTodoItem() {
    App.selectors.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && e.target.value.length) {
        // Create new Todo item based on the user input.
        Todos.add({
          id: generateUUIDv4(),
          title: e.target.value,
          completed: false,
        });
        // Reset input value.
        App.selectors.input.value = '';
      }
    });
  },
  /**
   * Creates single Todo item component based on Todo item data.
   *
   * @param {Object} todo - Todo item.
   * @returns {HTMLElement} - Li tag that represents Todo item.
   */
  createTodoItem(todo) {
    // Create li element representing single todo item.
    const li = document.createElement('li');
    // Get if current todo is completed.
    const isCompleted = todo.completed;
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
					${isCompleted ? 'checked' : ''}>
				<label class="text-lg ${
          isCompleted ? 'line-through' : false
        }" data-todo="label"></label>
				<button class="destroy ml-auto" data-todo="remove">X</button>
			</div>
			<input class="edit hidden absolute inset-0 w-full h-full" data-todo="edit">
		`
    );
    // Set label for Todo item.
    li.querySelector('[data-todo="label"]').textContent = todo.title;
    // Set value for edit state.
    li.querySelector('[data-todo="edit"]').value = todo.title;
    // Return element.
    return li;
  },
  /**
   * Delegates given event from the list to Todo item on which event occured.
   *
   * @param {String} event - Name of the event that we want to run.
   * @param {String} selector - CSS selector that will find element to which we want attach the given event.
   * @param {Function} handler - Function that we want to run on given event.
   */
  handleTodoItemEvent(event, selector, handler) {
    delegateEvent(App.selectors.list, selector, event, (e) => {
      const element = e.target.closest('[data-id]');
      handler(Todos.get(element.dataset.id));
    });
  },
  /**
   * Binds all App related events.
   */
  bindEvents() {
    // Refresh view everytime Todos data changed.
    Todos.addEventListener('save', App.render);
    // Handle filter change.
    window.addEventListener('hashchange', () => {
      App.filter = getURLHash();
      App.render();
    });
    // Handle item addition.
    App.addTodoItem();
    // Handle completed state change of Todo item.
    App.handleTodoItemEvent('click', '[data-todo="toggle"]', (todo) =>
      Todos.toggle(todo)
    );
    // Handle cleanse of completed Todo items.
    App.selectors.clear.addEventListener('click', () => {
      Todos.clearCompleted();
    });
    // Handle removal of Todo item.
    App.handleTodoItemEvent('click', '[data-todo="remove"]', (todo) =>
      Todos.remove(todo)
    );
  },
  /**
   * Handles initial work before render action.
   */
  init() {
    handleThemeSwitcher();
    App.filter = getURLHash();
    App.bindEvents();
    App.render();
  },
  /**
   * Renders the app components that depends of the App state.
   */
  render() {
    const count = Todos.getFiltered('all').length;
    App.setActiveFilter(App.filter);
    App.selectors.list.replaceChildren(
      ...Todos.getFiltered(App.filter).map((todo) => App.createTodoItem(todo))
    );
    App.showList(count);
    App.showFooter(count);
    App.showCounter(Todos.getFiltered('active').length);
    App.showClear(Todos.hasCompleted());
  },
};
// Boot the App.
App.init();
