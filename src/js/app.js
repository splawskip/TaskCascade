import { delegateEvent, generateUUIDv4, getURLHash, insertHTML, replaceHTML } from './utils';
import handleThemeSwitcher from './theme-switch';
import { TodoStorage } from './todo-storage';

/**
 * Object that scaffolds the app.
 * Holds configuration variables and methods responsible for app manipulations.
 */
const App = {
  /**
   * TodoStorage instance for handling storage.
   *
   * @typedef {null|TodoStorage} Storage
   */
  Storage: null,
  /**
   * Object that holds references to various DOM elements used by the app.
   *
   * @property {HTMLElement} input - The input element for creating new todos.
   * @property {HTMLElement} list - The list element for displaying todos.
   * @property {HTMLElement} footer - The footer element for displaying todo statistics and filters.
   * @property {HTMLElement} counter - The element for displaying the count of remaining todos.
   * @property {NodeListOf<HTMLAnchorElement>} filters - The collection of filter links.
   * @property {HTMLElement} clear - The element for clearing completed todos.
   */
  $: {
    input: document.querySelector('[data-todo="new"]'),
    list: document.querySelector('[data-todo="list"]'),
    footer: document.querySelector('[data-todo="footer"]'),
    counter: document.querySelector('[data-todo="count"]'),
    filters: document.querySelectorAll('[data-todo="filters"] a'),
    clear: document.querySelector('[data-todo="clear-completed"]'),
  },
  /**
   * Changes active state of filter elements based on value.
   *
   * @param {string} filter - Filter name.
   * @returns {void}
   */
  setActiveFilter(filter) {
    // Loop over filters and find matching one.
    App.$.filters.forEach((element) => {
      // Make matchin filter active.
      if (element.matches(`[href="#/${filter}"]`)) {
        element.classList.add('active', 'font-bold', 'text-indigo-600');
      } else {
        // Make other filters inactive.
        element.classList.remove('active', 'font-bold', 'text-indigo-600');
      }
    });
  },
  /**
   * Changes visbility state of the element based on value.
   *
   * @param {number|bool} show - Tells if component should be visible.
   * @returns {void}
   */
  showList(show) {
    App.$.list.style.display = show ? 'block' : 'none';
  },
  /**
   * Changes visbility state of the element based on value.
   *
   * @param {number|bool} show - Tells if component should be visible.
   * @returns {void}
   */
  showFooter(show) {
    App.$.footer.style.display = show ? 'flex' : 'none';
  },
  /**
   * Updates Counter component state.
   *
   * @param {number|bool} count - Tells if component should be visible.
   * @returns {void}
   */
  updateCounter(count) {
    replaceHTML(App.$.counter, `${count} ${count === 1 ? 'item' : 'items'} left`);
  },
  /**
   * Changes visbility state of the element based on value.
   *
   * @param {number|bool} show - Tells if component should be visible.
   * @returns {void}
   */
  showClear(show) {
    App.$.clear.style.display = show ? 'block' : 'none';
  },
  /**
   * Adds new Todo item to the storage.
   *
   * @returns {void}
   */
  addTodoItem() {
    App.$.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && e.target.value.length) {
        // Create new Todo item based on the user input.
        App.Storage.add({
          id: generateUUIDv4(),
          title: e.target.value,
          completed: false,
        });
        // Reset input value.
        App.$.input.value = '';
      }
    });
  },
  /**
   * Enables edit state on todo item component.
   *
   * @param {object} todo - Todo item.
   * @param {HTMLElement} li - Todo item HTMLElement.
   * @returns {void}
   */
  editTodoItem(todo, li) {
    // Add class that indicates that we are in edit state.
    li.classList.add('editing');
    // Grab edit input.
    const editInput = li.querySelector('[data-todo="edit"]');
    // Show edit input with focus.
    editInput.classList.remove('hidden');
    editInput.focus(); // Safari prevents triggering focus event so user will need to interact.
  },
  /**
   * Creates single Todo item component based on Todo item data.
   *
   * @param {object} todo - Todo item data object.
   * @returns {HTMLElement} - Li tag that represents single Todo item.
   */
  createTodoItem(todo) {
    // Create li element representing single todo item.
    const li = document.createElement('li');
    // Get todo item completion state.
    const isCompleted = todo.completed;
    // Apply Tailwind classes.
    li.classList.add(
      'group',
      'relative',
      'border-b',
      'border-slate-300',
      'bg-white',
      'px-6',
      'py-5',
      'transition-colors',
      'first:rounded-t-md',
      'hover:border-indigo-400',
      'dark:border-bright',
      'dark:bg-ebony',
      'hover:dark:border-indigo-600'
    );
    // Set id of the todo item on the element.
    li.dataset.id = todo.id;
    // Insert additional HTML into Li element.
    insertHTML(
      li,
      `
        <div class="flex flex-row flex-nowrap items-center justify-start gap-4">
          <input
            class="toggle relative h-6 w-6 min-w-[24px] cursor-pointer appearance-none overflow-hidden rounded-full border border-solid border-snuff bg-transparent outline-none before:absolute before:left-0 before:top-1/3 before:h-1/2 before:w-[3px] before:origin-bottom-left before:translate-x-[10px] before:-rotate-45 before:bg-white before:opacity-0 before:content-[''] after:absolute after:left-0 after:bottom-[20%] after:h-[3px] after:w-3/4 after:origin-bottom-left after:translate-x-[10px] after:-rotate-45 after:bg-white after:opacity-0 after:content-[''] checked:border-transparent checked:bg-gradient checked:before:opacity-100 checked:after:opacity-100 hover:ring-2 hover:ring-indigo-600 hover:transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-bright"
            data-todo="toggle"
            type="checkbox" ${isCompleted ? 'checked' : ''}>
          <label class="transition-colors break-all cursor-pointer grow text-lg text-mulled-wine dark:text-periwinkle-gray outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md
          ${isCompleted ? 'text-mischka dark:text-trout line-through' : ''}" tabindex="0" data-todo="label"></label>
          <button
            class="destroy pointer-events-none relative ml-auto h-5 w-5 min-w-[20px] opacity-0 outline-none transition-opacity before:absolute before:top-1/2 before:left-1/2 before:h-px before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:border before:border-solid before:border-slate-400 before:transition-colors before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-px after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:border after:border-solid after:border-slate-400 after:transition-colors after:content-[''] hover:before:border-indigo-600 hover:after:border-indigo-600 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-600 group-hover:pointer-events-auto group-hover:opacity-100 rounded-md"
            data-todo="remove"
          ></button>
        </div>
        <input
            class="absolute z-10 appearance-none inset-0 hidden h-full w-full rounded-md bg-white px-6 py-5 text-lg shadow-xl outline-none transition-colors placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600 dark:bg-ebony dark:text-slate-300 caret-indigo-600"
            data-todo="edit"
          />
      `
    );
    // Set label for Todo item and sanitize value entered by the user.
    li.querySelector('[data-todo="label"]').textContent = todo.title;
    // Set value for edit state.
    li.querySelector('[data-todo="edit"]').value = todo.title;
    // Return element.
    return li;
  },
  /**
   * Delegates given event from the list to Todo item on which event occured.
   *
   * @param {string} event - Name of the event that we want to run.
   * @param {string} selector - CSS selector that will find element to which we want attach the given event.
   * @param {Function} handler - Function that we want to run on given event.
   * @returns {void}
   */
  handleTodoItemEvent(event, selector, handler) {
    delegateEvent(App.$.list, selector, event, (e) => {
      // Grab li element that holds Todo item id.
      const element = e.target.closest('[data-id]');
      // Pass Todo item object, li element and event object to the handler.
      handler(App.Storage.get(element.dataset.id), element, e);
    });
  },
  /**
   * Sets the instances of other classes used by the app.
   *
   * @returns {void}
   */
  setInstances() {
    App.Storage = new TodoStorage('TaskCascade');
  },
  /**
   * Binds all App related events.
   *
   * @returns {void}
   */
  bindEvents() {
    // Refresh view everytime Todos data changed.
    App.Storage.addEventListener('save', App.render);
    // Handle filter change.
    window.addEventListener('hashchange', () => {
      App.filter = getURLHash();
      App.render();
    });
    // Handle item addition.
    App.addTodoItem();
    // Handle completed state change of Todo item.
    App.handleTodoItemEvent('click', '[data-todo="toggle"]', (todo) => App.Storage.toggle(todo));
    // Handle removal of Todo item.
    App.handleTodoItemEvent('click', '[data-todo="remove"]', (todo) => App.Storage.remove(todo));
    // Enable edit state on Todo item via mouse.
    App.handleTodoItemEvent('dblclick', '[data-todo="label"]', App.editTodoItem);
    // Enable edit state on Todo item via keyboard.
    App.handleTodoItemEvent('keyup', '[data-todo="label"]', (todo, li, e) => {
      if (e.key === 'Enter') App.editTodoItem(todo, li, e);
    });
    // Handle update of Todo item.
    App.handleTodoItemEvent('keyup', '[data-todo="edit"]', (todo, li, e) => {
      // Grab edit input.
      const editInput = li.querySelector('[data-todo="edit"]');
      // Update Todo item and remove edit state.
      if (e.key === 'Enter' && editInput.value) {
        li.classList.remove('editing');
        editInput.classList.add('hidden');
        App.Storage.update({ ...todo, title: editInput.value });
      }
      // Remove focus state from edit input.
      if (e.key === 'Escape') document.activeElement.blur();
    });
    // Handle App re-render when edit is done.
    App.handleTodoItemEvent('focusout', '[data-todo="edit"]', (todo, li) => {
      if (li.classList.contains('editing')) App.render();
    });
    // Handle cleanse of completed Todo items.
    App.$.clear.addEventListener('click', () => {
      App.Storage.clearCompleted();
    });
  },
  /**
   * Renders App components based on state.
   *
   * @returns {void}
   */
  render() {
    // Get todo items count.
    const count = App.Storage.getByFilter('all').length;
    // Update state filters state.
    App.setActiveFilter(App.filter);
    // Render todo items.
    App.$.list.replaceChildren(...App.Storage.getByFilter(App.filter).map((todo) => App.createTodoItem(todo)));
    // Update state of components based on Todo items count.
    App.showList(count);
    App.showFooter(count);
    App.updateCounter(App.Storage.getByFilter('active').length);
    App.showClear(App.Storage.hasCompleted());
  },
  /**
   * Handles initial work before render action.
   *
   * @returns {void}
   */
  init() {
    handleThemeSwitcher();
    App.setInstances();
    App.filter = getURLHash();
    App.bindEvents();
    App.render();
  },
};
// Boot the App.
App.init();
