//global variables that will store the toolbox colour palette

const BG_COLORS = [
  { color: "#ffffff" },
  { color: "#f8f9fa" },
  { color: "#f5faff" },
  { color: "#fffce8" },
  { color: "#fdf8f6" },
];

//amnd the helper functions
var toolbox = null;
var colourP = null;
var backgroundP = null;
var helpers = null;
/** @type {HistoryManager} */
var historyManager = null;

/** @type {DrawElement[]} */
var elements = [];
let isPanning = false;
let startX, startY;
var backgroundColor = BG_COLORS[0].color;

var isTyping = false; // For when the user is typing in the text tool

function setup() {
  //create a canvas to fill the content div from index.html
  canvasContainer = select("#content");
  var c = createCanvas(
    canvasContainer.size().width,
    canvasContainer.size().height
  );
  c.parent("content");

  // create helper functions and the colour palette
  helpers = new HelperFunctions();
  colourP = new ColourPalette();
  backgroundP = new BackgroundPalette();
  historyManager = new HistoryManager();

  // create a toolbox for storing the tools
  toolbox = new Toolbox();

  //add the tools to the toolbox.
  toolbox.addTool(new EllipseTool());
  toolbox.addTool(new SquareTool());
  toolbox.addTool(new DiamondTool());
  toolbox.addTool(new ArrowTool());
  toolbox.addTool(new LineToTool());
  toolbox.addTool(new FreehandTool());
  toolbox.addTool(new SprayCanTool());
  toolbox.addTool(new AngleBrushTool());
  toolbox.addTool(new RainbowBrushTool());
  toolbox.addTool(new MirrorDrawTool());
  toolbox.addTool(new TextTool());
  toolbox.addTool(new EraserTool());
  toolbox.addTool(new LaserTool());
  toolbox.addTool(new ImageTool());
  toolbox.addTool(new SelectTool());

  const selectedTool = getConfig("selectedTool", toolbox.tools[0].name);
  toolbox.selectTool(selectedTool ?? toolbox.tools[0].name);

  background(255);

  colourP.loadSavedColor();
  backgroundP.loadSavedColor();

  elements = getSavedElements() ?? [];
  historyManager.undoStack = [[...elements]];

  // Call the setup function for each tool in the toolbox
  toolbox.tools.forEach((tool) => {
    if (tool?.setup) {
      tool.setup(); // Call the setup function for each tool
    }
  });
}

function draw() {
  background(backgroundColor);

  if (isPanning) {
    let dx = mouseX - startX;
    let dy = mouseY - startY;

    for (let i = 0; i < elements.length; i++) {
      if (pointsBasedTool(elements[i])) {
        // Update the points for the freehand element only once
        const updatedPoints = elements[i].points.map((point) => ({
          x: point.x + dx,
          y: point.y + dy,
          color: point.color ?? undefined,
        }));

        updateElement(elements[i].id, {
          points: updatedPoints,
        });
      } else {
        // Update the position for non-freehand elements
        updateElement(elements[i].id, {
          posX: elements[i].posX + dx,
          posY: elements[i].posY + dy,
        });
      }
    }

    // Update startX and startY after the loop
    startX = mouseX;
    startY = mouseY;
  }

  for (let i = 0; i < elements?.length; i++) {
    if (nodesHandlers[elements[i].type]) {
      nodesHandlers[elements[i].type](elements[i]);
    }
  }

  if (!insideCanvas() && toolbox.selectedTool.hasOwnProperty("onMouseOut")) {
    toolbox.selectedTool.onMouseOut();
  }

  // call the draw function from the selected tool
  if (toolbox.selectedTool.hasOwnProperty("draw")) {
    if (insideCanvas()) {
      toolbox.selectedTool.draw();
    }
  } else {
    alert("it doesn't look like your tool has a draw method!");
  }

  if (isPanning) cursor(MOVE);
}

function mousePressed(e) {
  // Check if the scroll button is clicked
  if (mouseButton === CENTER) {
    isPanning = true;
    startX = mouseX;
    startY = mouseY;
  } else {
    if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
      if (!insideCanvas()) return;

      toolbox.selectedTool.mousePressed(e);
    }
  }
}

function doubleClicked(e) {
  if (toolbox.selectedTool.hasOwnProperty("doubleClicked")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.doubleClicked(e);
  }
}

function mouseReleased(e) {
  if (mouseButton === CENTER) {
    isPanning = false;
  } else {
    if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
      if (!insideCanvas()) return;

      toolbox.selectedTool.mouseReleased(e);
    }
  }

  // Handle history
  if (
    insideCanvas() &&
    toolbox.selectedTool.type !== "notSaveInHistory" &&
    mouseButton === LEFT
  ) {
  }

  if (
    !deepEqual(elements, historyManager.undoStack[historyManager.stackIndex])
  ) {
    elements = elements.map((e) => ({
      ...e,
      version: generateVersionNonce(),
    }));

    historyManager.saveState(elements);
  }
}

function mouseDragged(e) {
  if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.mouseDragged(e);
  }
}

function keyPressed(e) {
  // Undo
  if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
    undo();
  }
  // Redo
  if (e.keyCode == 89 && (e.ctrlKey || e.metaKey)) {
    redo();
  }

  // Del key
  if (e.keyCode == 46) {
    elements.forEach((e) => {
      if (e.selected) {
        deleteElement(e.id);
      }
    });
  }

  if (toolbox.selectedTool.hasOwnProperty("keyPressed")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.keyPressed(e);
  }

  if (toolbox.keyPressed) {
    toolbox.keyPressed(e);
  }
}

function insideCanvas() {
  let elementUnderMouse = document.elementFromPoint(mouseX, mouseY);

  if (
    !elementUnderMouse ||
    elementUnderMouse.tagName.toLowerCase() !== "canvas"
  ) {
    return false;
  }

  return true;
}

/**
 * Draw a tooltip at the given x and y position. The tooltip will display the x and y coordinates for testing purposes.
 */
function drawTooltip(x, y) {
  const padding = 5;
  const tooltipText = `(${x}, ${y})`;

  // Set text properties
  textSize(16);
  textAlign(LEFT, TOP);
  let textWidthValue = textWidth(tooltipText);
  let textHeightValue = textAscent() + textDescent();

  // Draw a rectangle behind the text for the tooltip
  fill(0, 0, 0, 150); // Semi-transparent black background
  noStroke();
  rect(
    x + padding,
    y + padding,
    textWidthValue + padding * 2,
    textHeightValue + padding * 2
  );

  // Draw the text on top of the rectangle
  fill(255); // White text color
  text(tooltipText, x + padding * 2, y + padding * 2);
}
