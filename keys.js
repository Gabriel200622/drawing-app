/**
 * Converts a given character to its corresponding key code.
 *
 * @function charToKeyCode
 * @param {string} char - A single character to be converted. The character is first converted to uppercase.
 * @returns {number} The key code of the character, as per its Unicode value.
 */
const charToKeyCode = (char) => {
  let keyCode = char.toUpperCase().charCodeAt(0);

  return keyCode;
};
