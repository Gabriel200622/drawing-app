/**
 * History Manager
 * @description Manages undo and redo actions
 */
function HistoryManager() {
  /** @type {DrawElement[][]} */
  this.undoStack = [[]];
  this.stackIndex = 0;

  var self = this;

  /**
   * Save the current state of the elements, if they have changed
   * @param {DrawElement[]} elements
   */
  this.saveState = function (elements) {
    const currentElements = self.undoStack[self.stackIndex] || [];

    // Check if there are any changes in the elements
    const isChanged = elements.some((element, index) => {
      return (
        !currentElements[index] ||
        element.version !== currentElements[index].version
      );
    });

    if (isChanged) {
      // Save the new state if there's a change
      self.undoStack = self.undoStack.slice(0, self.stackIndex + 1); // Remove any redo history
      self.undoStack.push([...elements]);
      self.stackIndex = self.undoStack.length - 1;
    }
  };

  /**
   * Undo the last action
   */
  this.undo = function (elements) {
    if (self.stackIndex > 0) {
      self.stackIndex--;
      const stack = self.undoStack[self.stackIndex];
      return stack || [];
    }
    return elements;
  };

  /**
   * Redo the last undone action
   */
  this.redo = function (elements) {
    if (self.stackIndex < self.undoStack.length - 1) {
      self.stackIndex++;
      return self.undoStack[self.stackIndex];
    }
    return elements;
  };
}
