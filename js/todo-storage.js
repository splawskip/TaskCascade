import { generateUUIDv4 } from './utils';

export class TodoStorage extends EventTarget {
  /**
   * Creates an instance of the TodoStorage.
   *
   * @constructor
   * @param {String} localStorageKey - Name for the localStorage item key that will be used by the instance of the class.
   * @returns {Void}
   */
  constructor(localStorageKey) {
    // Extend EventTarget object.
    super();
    // Set local storage key.
    this.localStorageKey = localStorageKey;
    // Get todos from local storage.
    this.todos = this.read();
    // Handle case when localStorage is changed in another window.
    this.handleCrossWindowEdit();
  }

  /**
   * Saves todo items into localStorage.
   *
   * @returns {Void}
   */
  save() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
    // As TodoStorage extends EventTarget, the class is able to handle events.
    this.dispatchEvent(new CustomEvent('save'));
  }

  /**
   * Reads todo items from the localStorage.
   *
   * @returns {Array} - Array of todo items.
   */
  read() {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  /**
   * Adds new todo item to the storage.
   *
   * @param {Object} todo - Todo item.
   * @returns {Void}
   */
  add(todo) {
    this.todos.push({
      id: generateUUIDv4(),
      title: todo.title,
      completed: false,
    });
    this.save();
  }

  /**
   * Removes todo item from the storage.
   *
   * @param {String} id - ID of the todo item.
   * @returns {Void}
   */
  remove({ id }) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.save();
  }

  /**
   * Modifies given todo item.
   *
   * @param {Object} newTodo - Modified todo item.
   * @returns {Void}
   */
  update(newTodo) {
    this.todos = this.todos.map((oldTodo) =>
      oldTodo.id === newTodo.id ? newTodo : oldTodo
    );
    this.save();
  }

  /**
   * Get todo item by id.
   *
   * @param {String} id - ID of the todo item.
   * @returns {Object} - Todo item.
   */
  get(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  /**
   * Gets todo items filtered by given filter.
   *
   * @param {String} filter - String that represents filter name.
   * @returns {Array} - Array of todos filtered by given filter.
   */
  getByFilter(filter) {
    // Get container for filtered todos.
    let filteredTodos = [];
    // Resolve which type of todos should be returned.
    switch (filter) {
      case 'active':
        filteredTodos = this.todos.filter((todo) => !todo.completed);
        break;
      case 'completed':
        filteredTodos = this.todos.filter((todo) => todo.completed);
        break;
      case 'all':
      default:
        filteredTodos = this.todos;
    }
    // Show filtered todos to the world.
    return filteredTodos;
  }

  /**
   * Returns if at least one todo in the storage is completed.
   *
   * @returns {Bool} - Bool that determines if at leats one todo in storage is completed.
   */
  hasCompleted() {
    return this.todos.some((todo) => todo.completed);
  }

  /**
   * Returns if all todos in the storage are completed.
   *
   * @returns {Bool} - Bool that determines if all todos in storage are completed.
   */
  hasAllCompleted() {
    return this.todos.every((todo) => todo.completed);
  }

  /**
   * Toggles completed state of given todo.
   *
   * @param {String} id - ID of the todo.
   * @returns {Void}
   */
  toggle({ id }) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.save();
  }

  /**
   * Toggles completed state of all todos.
   *
   * @returns {Void}
   */
  toggleAll() {
    const completed = !this.hasCompleted() || !this.hasAllCompleted();
    this.todo = this.todos.map((todo) => ({ ...todo, completed }));
    this.save();
  }

  /**
   * Removes completed todos from storage.
   *
   * @returns {Void}
   */
  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.save();
  }

  /**
   * Handles localStorage modifications from another window.
   *
   * @returns {Void}
   */
  handleCrossWindowEdit() {
    window.addEventListener(
      'storage',
      () => {
        this.read();
        this.save();
      },
      false
    );
  }
}
