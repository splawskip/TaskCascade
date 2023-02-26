/**
 * Returns currently used URL hash.
 *
 * @returns {String} - String that represents currently used URL hash.
 */
export const getURLHash = () => document.location.hash.replace(/^#\//, '');

/**
 * Delegates given handler for given event to given element.
 *
 * @param {*} el
 * @param {*} selector
 * @param {*} event
 * @param {*} handler
 * @returns {Void}
 */
export const delegateEvent = (el, selector, event, handler) => {
  el.addEventListener(event, (e) => {
    if (e.target.matches(selector)) handler(e, el);
  });
};

/**
 * Inserts given html into given element.
 *
 * @param {*} el
 * @param {*} html
 * @returns {Void} - Inserts given html afterbegin of the given element.
 */
export const insertHTML = (el, html) =>
  el.insertAdjacentHTML('afterbegin', html);

/**
 * Replaces content of the given element with given html.
 *
 * @param {*} el
 * @param {*} html
 * @returns {Void}
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
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
/* eslint-enable no-bitwise */
