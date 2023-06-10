import { generateUUIDv4 } from './utils';

/**
 * Represents a TodoStorage class for managing todo items.
 * @extends EventTarget
 */
export class TodoStorage extends EventTarget {
  /**
   * Creates an instance of the TodoStorage.
   *
   * @constructor
   * @param {string} localStorageKey - Name for the localStorage item key that will be used by the instance of the class.
   * @returns {void}
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
   * @returns {void}
   */
  save() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
    // As TodoStorage extends EventTarget, the class is able to handle events.
    this.dispatchEvent(new CustomEvent('save'));
  }

  /**
   * Reads todo items from the localStorage.
   *
   * @returns {array} - Array of todo items.
   */
  read() {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  /**
   * Adds a new todo item to the storage.
   *
   * @param {object} todo - Todo item.
   * @returns {void}
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
   * Removes a todo item from the storage.
   *
   * @param {string} id - ID of the todo item.
   * @returns {void}
   */
  remove({ id }) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.save();
  }

  /**
   * Modifies a given todo item.
   *
   * @param {object} newTodo - Modified todo item.
   * @returns {void}
   */
  update(newTodo) {
    this.todos = this.todos.map((oldTodo) => (oldTodo.id === newTodo.id ? newTodo : oldTodo));
    this.save();
  }

  /**
   * Get a todo item by ID.
   *
   * @param {string} id - ID of the todo item.
   * @returns {object} - Todo item.
   */
  get(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  /**
   * Gets todo items filtered by the given filter.
   *
   * @param {string} filter - String that represents filter name.
   * @returns {array} - Array of todos filtered by the given filter.
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
   * Checks if at least one todo in the storage is completed.
   *
   * @returns {boolean} - Boolean indicating if at least one todo in storage is completed.
   */
  hasCompleted() {
    return this.todos.some((todo) => todo.completed);
  }

  /**
   * Checks if all todos in the storage are completed.
   *
   * @returns {boolean} - Boolean indicating if all todos in storage are completed.
   */
  hasAllCompleted() {
    return this.todos.every((todo) => todo.completed);
  }

  /**
   * Toggles the completed state of a given todo.
   *
   * @param {string} id - ID of the todo.
   * @returns {void}
   */
  toggle({ id }) {
    this.todos = this.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    this.save();
  }

  /**
   * Removes completed todos from storage.
   *
   * @returns {void}
   */
  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.save();
  }

  /**
   * Changes the index of an todo item in the storage.
   *
   * @param {string} id - The ID of the todo item.
   * @param {number} newTodoIndex - The new index for the todo item.
   * @returns {void}
   */
  changeTodoIndex(id, newTodoIndex) {
    // Get current index of todo by given todo id.
    const currentTodoIndex = this.todos.findIndex((todo) => todo.id === id);
    // If we got the index change.
    if (currentTodoIndex > -1) {
      // Extract todo with found index from our storage.
      const [todo] = this.todos.splice(currentTodoIndex, 1);
      // Insert todo at new index.
      this.todos.splice(newTodoIndex, 0, todo);
      // Save.
      this.save();
    }
  }

  /**
   * Handles localStorage modifications from another window.
   *
   * @returns {void}
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
