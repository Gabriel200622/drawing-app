/**
 * HistoryManager
 * @class
 * @description A utility class that manages undo and redo actions.
 * It maintains a stack of states representing the drawing elements, allowing users to revert or reapply changes.
 */
function HistoryManager() {
  /**
   * The stack of saved drawing states. Each state is represented as an array of drawing elements.
   * The stack grows as new states are saved, and can be navigated backward (undo) or forward (redo).
   *
   * @type {DrawElement[][]}
   */
  this.undoStack = [[]];

  /**
   * The current index within the undo stack. This index indicates the most recent state the user is currently viewing.
   *
   * @type {number}
   */
  this.stackIndex = 0;

  /**
   * Saves the current state of the drawing elements to the undo stack.
   * The new state is saved as a deep copy to prevent accidental modifications to past states.
   *
   * @param {DrawElement[]} elements - The current array of drawing elements to be saved.
   */
  this.saveState = function (elements) {
    this.undoStack.push([...elements]);
    this.stackIndex = this.undoStack.length - 1; // Set the index to the latest saved state.
  };

  /**
   * Undoes the last action by reverting to the previous state in the undo stack.
   * The state returned is a deep copy to avoid direct reference issues.
   *
   * @param {DrawElement[]} elements - The current array of drawing elements before undo.
   * @returns {DrawElement[]} A deep copy of the previous state of drawing elements, or the current state if undo is unavailable.
   */
  this.undo = function (elements) {
    if (this.stackIndex > 0) {
      this.stackIndex = this.stackIndex - 1;

      // Return a deep copy of the previous state
      const stack = this.undoStack[this.stackIndex].map((element) => ({
        ...element,
      }));

      return stack;
    }

    // If undo is not possible, return the current state
    return elements;
  };

  /**
   * Redoes the last undone action by moving forward in the undo stack.
   * The state returned is a deep copy to avoid reference issues.
   *
   * @param {DrawElement[]} elements - The current array of drawing elements before redo.
   * @returns {DrawElement[]} A deep copy of the next state of drawing elements, or the current state if redo is unavailable.
   */
  this.redo = function (elements) {
    if (this.stackIndex < this.undoStack.length - 1) {
      this.stackIndex++;

      // Return a deep copy of the next state
      return this.undoStack[this.stackIndex].map((element) => ({ ...element }));
    }
    // If redo is not possible, return the current state
    return elements;
  };
}
