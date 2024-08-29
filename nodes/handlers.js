/**
 * @param {DrawElement} element - The element to draw.
 */
const drawEllipse = (element) => {
  // Draw the selected box if the element is selected
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);
  const bgColor = handleDeletingColor(element, element.bgColor);

  fill(bgColor);
  stroke(strokeColor);
  strokeWeight(element.strokeWidth);
  if (!element.stroke) {
    noStroke();
  }
  const centerX = element.posX + element.sizeX / 2;
  const centerY = element.posY + element.sizeY / 2;
  ellipse(centerX, centerY, element.sizeX, element.sizeY);
};

/**
 * @param {DrawElement} element - The element to draw.
 */
const drawSquare = (element) => {
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);
  const bgColor = handleDeletingColor(element, element.bgColor);

  fill(bgColor);
  stroke(strokeColor);
  strokeWeight(element.strokeWidth);
  if (!element.stroke) {
    noStroke();
  }
  rect(element.posX, element.posY, element.sizeX, element.sizeY);
};

/**
 * @param {DrawElement} element - The element to draw.
 */
const drawDiamond = (element) => {
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);
  const bgColor = handleDeletingColor(element, element.bgColor);

  fill(bgColor);
  stroke(strokeColor);
  strokeWeight(element.strokeWidth);
  if (!element.stroke) {
    noStroke();
  }

  const centerX = element.posX + element.sizeX / 2;
  const centerY = element.posY + element.sizeY / 2;

  beginShape();
  vertex(centerX, element.posY);
  vertex(element.posX + element.sizeX, centerY);
  vertex(centerX, element.posY + element.sizeY);
  vertex(element.posX, centerY);
  endShape(CLOSE);
};

/**
 * @param {DrawElement} element - The element to draw.
 */
const drawArrow = (element) => {
  // Draw the selected box if the element is selected
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);

  stroke(strokeColor);
  strokeWeight(element.strokeWidth);

  let x1 = element.posX;
  let y1 = element.posY;
  let x2 = element.sizeX + element.posX;
  let y2 = element.sizeY + element.posY;

  let angle = atan2(y2 - y1, x2 - x1);
  let headSize = 10;

  // Draw arrow line
  line(x1, y1, x2, y2);

  // Draw arrow head
  push();
  translate(x2, y2);
  rotate(angle);
  beginShape();
  vertex(0, 0);
  vertex(-headSize, headSize / 2);
  vertex(-headSize, -headSize / 2);
  endShape(CLOSE);
  pop();
};

/**
 * @param {DrawElement} element - The element to draw.
 */
const drawLine = (element) => {
  // Draw the selected box if the element is selected
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);

  stroke(strokeColor);
  strokeWeight(element.strokeWidth);

  line(
    element.posX,
    element.posY,
    element.posX + element.sizeX,
    element.posY + element.sizeY
  );
};

/**
 * @param {DrawElement} element - The element to draw.
 */
const drawFreehand = (element) => {
  // Draw the selected box if the element is selected
  if (element.selected) {
    drawSelectedBox(element);
  }

  const strokeColor = handleDeletingColor(element, element.strokeColor);

  stroke(strokeColor);
  strokeWeight(element.strokeWidth);

  if (element.points.length > 1) {
    for (let i = 1; i < element.points.length; i++) {
      line(
        element.points[i].x,
        element.points[i].y,
        element.points[i - 1].x,
        element.points[i - 1].y
      );
    }
  }
};

/**
 * @param {DrawElement} element - The element to draw a box on.
 */
const drawSelectedBox = (element) => {
  push();
  const selectedBoxMargin = 5;
  const buttonSize = 10; // Size of the corner buttons

  const { adjustedPosX, adjustedPosY, adjustedSizeX, adjustedSizeY } =
    getElementBox(element);

  // Draw the selection box
  strokeWeight(1);
  stroke(0, 0, 150);
  fill(0, 0, 150, 10);
  rect(
    adjustedPosX - selectedBoxMargin,
    adjustedPosY - selectedBoxMargin,
    adjustedSizeX + selectedBoxMargin * 2,
    adjustedSizeY + selectedBoxMargin * 2
  );

  // Draw buttons in each corner of the selection box
  fill(255);
  stroke(0, 0, 150);
  strokeWeight(2);

  // Top-left corner
  ellipse(
    adjustedPosX - selectedBoxMargin,
    adjustedPosY - selectedBoxMargin,
    buttonSize
  );

  // Top-right corner
  ellipse(
    adjustedPosX + adjustedSizeX + selectedBoxMargin,
    adjustedPosY - selectedBoxMargin,
    buttonSize
  );

  // Bottom-left corner
  ellipse(
    adjustedPosX - selectedBoxMargin,
    adjustedPosY + adjustedSizeY + selectedBoxMargin,
    buttonSize
  );

  // Bottom-right corner
  ellipse(
    adjustedPosX + adjustedSizeX + selectedBoxMargin,
    adjustedPosY + adjustedSizeY + selectedBoxMargin,
    buttonSize
  );

  pop();
};

/**
 * @typedef {Record<DrawElement['type'], function>} NodesHandlers
 */

/** @type {NodesHandlers} */
var nodesHandlers = {
  ellipse: drawEllipse,
  square: drawSquare,
  diamond: drawDiamond,
  arrow: drawArrow,
  lineTo: drawLine,
  freehand: drawFreehand,
};
