//global variables that will store the toolbox colour palette

//amnd the helper functions
var toolbox = null;
var colourP = null;
var backgroundP = null;
var helpers = null;

/** @type {DrawElement[]} */
var elements = [];

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
  toolbox.addTool(new MirrorDrawTool());
  toolbox.addTool(new TextTool());
  toolbox.addTool(new EraserTool());
  toolbox.addTool(new LaserTool());
  toolbox.addTool(new SelectTool());

  const selectedTool = getConfig("selectedTool", toolbox.tools[0].name);
  toolbox.selectTool(selectedTool ?? toolbox.tools[0].name);

  background(255);

  colourP.loadSavedColor();
  backgroundP.loadSavedColor();

  elements = getSavedElements();
}

function draw() {
  background(255, 255, 255);

  for (i = 0; i < elements.length; i++) {
    if (nodesHandlers[elements[i].type]) {
      nodesHandlers[elements[i].type](elements[i]);
    } else {
      // console.log(`Handler for ${elements[i].type} not found!`);
    }
  }

  if (!insideCanvas() && toolbox.selectedTool.hasOwnProperty("onMouseOut")) {
    toolbox.selectedTool.onMouseOut();
  }

  // drawTooltip(mouseX, mouseY);
  // console.log(elements);

  // call the draw function from the selected tool
  if (toolbox.selectedTool.hasOwnProperty("draw")) {
    if (insideCanvas()) {
      toolbox.selectedTool.draw();
    }
  } else {
    alert("it doesn't look like your tool has a draw method!");
  }
}

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

function mouseReleased() {
  // Handle history
  if (
    insideCanvas() &&
    toolbox.selectedTool.type !== "notSaveInHistory" &&
    mouseButton === LEFT
  ) {
  }

  if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.mouseReleased();
  }
}

function mousePressed() {
  if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.mousePressed();
  }
}

function mouseDragged() {
  if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.mouseDragged();
  }
}

function keyPressed(e) {
  // Undo
  if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
  }
  // Redo
  if (e.keyCode == 89 && (e.ctrlKey || e.metaKey)) {
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
}

function insideCanvas() {
  var elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
  if (
    !elementUnderMouse ||
    elementUnderMouse.tagName.toLowerCase() !== "canvas"
  ) {
    return false;
  }

  return true;
}
