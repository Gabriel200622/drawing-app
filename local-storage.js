/**
 * Saves a given value to localStorage under the specified key.
 *
 * @function setLocalStorage
 * @param {string} key - The key under which the value will be stored.
 * @param {*} value - The value to store in localStorage. The value will be serialized to a JSON string.
 */
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from localStorage based on the specified key.
 *
 * @function getLocalStorage
 * @param {string} key - The key used to retrieve the associated value from localStorage.
 * @returns {*} The value retrieved from localStorage, deserialized from JSON. Returns `null` if the key doesn't exist.
 */
function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
