/**
 * Returns the currently used URL hash.
 *
 * @returns {string} The string representation of the currently used URL hash.
 */
export const getURLHash = () => document.location.hash.replace(/^#\//, '');

/**
 * Delegates the given event to the provided element using the provided handler function.
 *
 * @param {HTMLElement} el - The element to which the event will be delegated.
 * @param {string} selector - The selector used to identify the target element(s) of the event.
 * @param {string} event - The name of the event to delegate.
 * @param {Function} handler - The function to call when the event is triggered on the target element(s).
 * @returns {void}
 */
export const delegateEvent = (el, selector, event, handler) => {
  el.addEventListener(event, (e) => {
    if (e.target.matches(selector)) handler(e, el);
  });
};

/**
 * Inserts the provided HTML into the given element using the 'afterbegin' position.
 *
 * @param {HTMLElement} el - The element into which to insert the HTML.
 * @param {string} html - The HTML string to insert into the element.
 * @returns {void}
 */
export const insertHTML = (el, html) => el.insertAdjacentHTML('afterbegin', html);

/**
 * Replaces the content of the given element with the provided HTML.
 *
 * @param {HTMLElement} el - The element whose content will be replaced.
 * @param {string} html - The HTML string to use as the new content for the element.
 * @returns {void}
 */
export const replaceHTML = (el, html) => {
  el.replaceChildren();
  insertHTML(el, html);
};

/* eslint-disable no-bitwise */
/**
 * Generates UUID version 4.
 *
 * @returns {String} - UUID v4.
 */
export function generateUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}
/* eslint-enable no-bitwise */

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - The debounced function.
 */
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    /**
     * Invokes `func` after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
     */
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles the execution of a function to a specified delay.
 *
 * @param {Function} func - The function to be throttled.
 * @param {number} delay - The minimum time interval between function executions.
 * @returns {Function} - The throttled function.
 */
export const throttle = (func, delay) => {
  let timerId;
  let lastExecTime = 0;

  /**
   * The throttled function.
   *
   * @param {...*} args - The arguments to be passed to the original function.
   */
  return function throttledFunction(...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime < delay) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = currentTime;
      }, delay);
    } else {
      func.apply(this, args);
      lastExecTime = currentTime;
    }
  };
};
