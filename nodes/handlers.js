/**
 * @param {DrawElement} element - The element to draw.
 */
const drawEllipse = (element) => {
  if (element.selected) {
    drawSelectedBox(element);
  }

  fill(element.bgColor);
  stroke(element.strokeColor);
  strokeWeight(element.strokeWidth);
  if (!element.stroke) {
    noStroke();
  }
  const centerX = element.posX + element.sizeX / 2;
  const centerY = element.posY + element.sizeY / 2;
  ellipse(centerX, centerY, element.sizeX, element.sizeY);
};

/**
 * @param {DrawElement} element - The element to draw a box on.
 */
const drawSelectedBox = (element) => {
  push();
  const selectedBoxMargin = 10;

  strokeWeight(1);
  stroke(0, 0, 150);
  fill(0, 0, 150, 10);
  rect(
    element.posX - selectedBoxMargin,
    element.posY - selectedBoxMargin,
    element.sizeX + selectedBoxMargin * 2,
    element.sizeY + selectedBoxMargin * 2
  );
  pop();
};

/**
 * @typedef {Record<DrawElement['type'], function>} NodesHandlers
 */

/** @type {NodesHandlers} */
var nodesHandlers = {
  ellipse: drawEllipse,
};
