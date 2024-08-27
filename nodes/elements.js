/**
 * @typedef {Object} DrawElement
 * @property {string} id - The unique identifier of the element.
 * @property {"ellipse" | "square" | "diamond" | "arrow" | "lineTo" | "freehand" | "sprayCan" | "mirrorDraw" | "text"} type - The type of the element.
 * @property {number} posX - The X position of the element.
 * @property {number} posY - The Y position of the element.
 * @property {number} sizeX - The width of the element.
 * @property {number} sizeY - The height of the element.
 * @property {string} bgColor - The background color of the element.
 * @property {string} strokeColor - The stroke color of the element.
 * @property {number} strokeWidth - The width of the stroke.
 * @property {boolean} stroke - Whether the element has a stroke.
 * @property {boolean} selected - Whether the element is selected.
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
};

/**
 * Upsert an element in the elements array.
 * @param {DrawElement} element - The element to upsert.
 */
const upsertElement = (element) => {
  const index = elements.findIndex((e) => e.id === element.id);
  if (index === -1) {
    addElement(element);
  } else {
    updateElement(element.id, element);
  }
};

/**
 * Deletes an element from the elements array.
 * @param {string} id - The unique identifier of the element.
 */
const deleteElement = (id) => {
  const index = elements.findIndex((e) => e.id === id);
  if (index === -1) return;

  elements.splice(index, 1);
};

/**
 * Finds an element by its unique identifier.
 * @param {string} id - The unique identifier of the element.
 */
const findElementById = (id) => {
  return elements.find((e) => e.id === id);
};

/**
 * Checks if the mouse click is inside any of the elements and returns all matching elements.
 * @param {number} mouseX - The X position of the mouse click.
 * @param {number} mouseY - The Y position of the mouse click.
 * @returns {{found: boolean, elements: DrawElement[]}}
 */
const checkClickInsideElements = (mouseX, mouseY) => {
  const elementsFound = [];

  for (const element of elements) {
    // Calculate the bounding box of the element
    const topLeftX = element.posX;
    const topLeftY = element.posY;
    const bottomRightX = element.posX + element.sizeX;
    const bottomRightY = element.posY + element.sizeY;

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
  const { found, elements: elementsFound } = checkClickInsideElements(
    mouseX,
    mouseY
  );

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
    updateElement(elementsFound[foundElementsIndex].id, { selected: true });

    // Update the current index to the next element in the list
    foundElementsIndex = (foundElementsIndex + 1) % elementsFound.length;
  }
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
