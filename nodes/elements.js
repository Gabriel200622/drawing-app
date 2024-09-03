/**
 * @typedef {Object} Point
 * @property {number} x - The X position of the point.
 * @property {number} y - The Y position of the point.
 */

/**
 * @typedef {Object} DrawElement
 * @property {string} id - The unique identifier of the element.
 * @property {"ellipse" | "square" | "diamond" | "arrow" | "lineTo" | "freehand" | "sprayCan" | "mirrorDraw" | "text" | "image"} type - The type of the element.
 * @property {number} posX - The X position of the element.
 * @property {number} posY - The Y position of the element.
 * @property {number} sizeX - The width of the element.
 * @property {number} sizeY - The height of the element.
 * @property {string} bgColor - The background color of the element.
 * @property {string} strokeColor - The stroke color of the element.
 * @property {number} strokeWidth - The width of the stroke.
 * @property {boolean} stroke - Whether the element has a stroke.
 * @property {boolean} selected - Whether the element is selected.
 * @property {Point[]} points - The points of the element.
 * @property {boolean} deleting - Whether the element is being deleted.
 * @property {string} text - The text of the element.
 * @property {boolean} focus - Whether the element is focused.
 * @property {number} fontSize - The font size of the text.
 * @property {string} imageUrl - The URL of the image.
 * @property {boolean} editingImg - Whether the image is being edited.
 */

/**
 * Adds an element to the elements array.
 * @param {DrawElement} element - The element to add.
 */
const addElement = (element) => {
  elements.push({
    id: element.id ?? generateUUID(),
    ...element,
  });

  saveElements();
};

/**
 * Updates an element in the elements array.
 * @param {string} id - The unique identifier of the element.
 * @param {DrawElement} element - The updated element.
 */
const updateElement = (id, element) => {
  const index = elements.findIndex((e) => e.id === id);
  if (index === -1) return;

  elements[index] = {
    ...elements[index],
    ...element,
  };

  saveElements();
};

/**
 * Upsert an element in the elements array.
 * @param {DrawElement} element - The element to upsert. If the element does not exist, it will be added.
 */
const upsertElement = (element) => {
  const index = elements.findIndex((e) => e.id === element.id);
  if (index === -1) {
    addElement(element);
  } else {
    updateElement(element.id, element);
  }

  saveElements();
};

/**
 * Deletes an element from the elements array.
 * @param {string} id - The unique identifier of the element.
 */
const deleteElement = (id) => {
  const index = elements.findIndex((e) => e.id === id);
  if (index === -1) return;

  const element = elements[index];
  if (element.type === "text") {
    removeInput(element);
  }
  if (element.type === "image") {
    removeImage(element);
  }

  elements.splice(index, 1);

  saveElements();
};

const emptyElements = () => {
  // Delete the elements from the html
  elements.forEach((element) => {
    if (element.type === "text") {
      removeInput(element);
    }
    if (element.type === "image") {
      removeImage(element);
    }
  });

  elements = [];

  saveElements();
};

/**
 * Finds an element by its unique identifier.
 * @param {string} id - The unique identifier of the element.
 */
const findElementById = (id) => {
  return elements.find((e) => e.id === id);
};

/**
 * Get the box of the element.
 * @param {DrawElement} element - The element to get the box.
 */
const getElementBox = (element) => {
  if (element.type === "freehand" || element.type === "sprayCan")
    return getFreehandBox(element);

  const adjustedPosX =
    element.sizeX < 0 ? element.posX + element.sizeX : element.posX;
  const adjustedPosY =
    element.sizeY < 0 ? element.posY + element.sizeY : element.posY;
  const adjustedSizeX = Math.abs(element.sizeX);
  const adjustedSizeY = Math.abs(element.sizeY);

  return {
    adjustedPosX,
    adjustedPosY,
    adjustedSizeX,
    adjustedSizeY,
  };
};

/**
 * Get the box of the element.
 * @param {DrawElement} element - The element to get the box.
 */
const getFreehandBox = (element) => {
  if (element.type !== "sprayCan" && element.type !== "freehand") return null;

  const minX = Math.min(...element.points.map((p) => p.x));
  const minY = Math.min(...element.points.map((p) => p.y));
  const maxX = Math.max(...element.points.map((p) => p.x));
  const maxY = Math.max(...element.points.map((p) => p.y));

  return {
    adjustedPosX: minX,
    adjustedPosY: minY,
    adjustedSizeX: maxX - minX,
    adjustedSizeY: maxY - minY,
  };
};

/**
 * Checks if the mouse click is inside any of the elements and returns all matching elements.
 * @param {number} mouseX - The X position of the mouse click.
 * @param {number} mouseY - The Y position of the mouse click.
 * @returns {{found: boolean, elements: DrawElement[]}}
 */

/**
 * Handles whether the mouse is hovering over any elements.
 * @param {number} mouseX - The X position of the mouse.
 * @param {number} mouseY - The Y position of the mouse.
 * @returns {{found: boolean, elements: DrawElement[]}}
 */
const hoveringElements = () => {
  const elementsFound = [];

  for (const element of elements) {
    const elementBox = getElementBox(element);
    if (!elementBox) return;
    const { adjustedPosX, adjustedPosY, adjustedSizeX, adjustedSizeY } =
      elementBox;

    const topLeftX = adjustedPosX;
    const topLeftY = adjustedPosY;
    const bottomRightX = adjustedPosX + adjustedSizeX;
    const bottomRightY = adjustedPosY + adjustedSizeY;

    // Check if the mouse click is inside the bounding box
    if (
      mouseX >= topLeftX &&
      mouseX <= bottomRightX &&
      mouseY >= topLeftY &&
      mouseY <= bottomRightY
    ) {
      elementsFound.push(element);
    }
  }

  return {
    found: elementsFound.length > 0,
    elements: elementsFound,
  };
};

let foundElementsIndex = 0; // Track the index of the currently selected element
/**
 * Handles the selection of elements based on the mouse position.
 */
const handleElementsSelection = () => {
  const { found, elements: elementsFound } = hoveringElements();

  // Deselect all elements
  elements.forEach((e) => {
    updateElement(e.id, { selected: false });
  });

  if (!found) {
    return;
  }

  // If there are elements found, select the one at the current index
  if (elementsFound.length > 0) {
    // Set the selected element
    if (elementsFound[foundElementsIndex]) {
      updateElement(elementsFound[foundElementsIndex].id, { selected: true });

      // Update the current index to the next element in the list
      foundElementsIndex = (foundElementsIndex + 1) % elementsFound.length;
    } else {
      foundElementsIndex = 0;
    }
  }
};

/**
 * Handles the deletion of the selected elements.
 * @param {DrawElement} element - The element to delete.
 */
const handleDeletingColor = (element, currentColor) => {
  const customColor = color(currentColor);
  if (element.deleting) customColor.setAlpha(30);

  return customColor;
};

/**
 * Gets all the selected elements.
 */
const getSelectedElements = () => {
  return elements.filter((element) => element.selected);
};

/**
 * Generates a UUID.
 */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Saves the elements to the local storage.
 */
const saveElements = () => {
  setConfigs("nodes", elements);
};

/**
 * Gets the saved elements from the local storage.
 */
const getSavedElements = () => {
  return getConfig("nodes", []);
};

// Inputs helpers

/**
 * Focus on the input of the element.
 * @param {DrawElement} element - The element to focus on.
 */
const inputFocus = (element) => {
  upsertElement({
    id: element.id,
    focus: true,
  });

  const input = document.querySelector(`.textToolInput-${element.id}`);
  input.focus();
  input.select();

  isTyping = true;
};

/**
 * Unfocus the input of the element.
 * @param {DrawElement} element - The element to unfocus.
 */
const inputUnfocus = (element) => {
  if (element?.text === "" || !element?.text) {
    deleteElement(element.id);
  } else {
    upsertElement({
      id: element.id,
      focus: false,
    });
  }

  isTyping = false;
};

/**
 * Remove the input of the element.
 * @param {DrawElement} element - The element to remove the input.
 */
const removeInput = (element) => {
  const inputExists = document.querySelector(`.textToolInput-${element.id}`);
  if (inputExists) inputExists.remove();

  isTyping = false;
};

// Image helpers

const removeImage = (element) => {
  const imageExists = document.querySelector(`.uploadedImage-${element.id}`);
  if (imageExists) imageExists.remove();
};
