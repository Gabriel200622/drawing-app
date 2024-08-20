//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var backgroundP = null;
var helpers = null;

let historyStates = [];
let historyIndex = 0;

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

  const selectedTool = getConfig("selectedTool", toolbox.tools[0].name);
  toolbox.selectTool(selectedTool ?? toolbox.tools[0].name);

  background(255);
  loadDrawing();

  setTimeout(() => {
    saveState();
  }, 200);

  colourP.loadSavedColor();
}

function draw() {
  // call the draw function from the selected tool.
  // hasOwnProperty is a javascript function that tests
  // if an object contains a particular method or property
  // if there isn't a draw method the app will alert the user
  if (toolbox.selectedTool.hasOwnProperty("draw")) {
    if (insideCanvas()) {
      toolbox.selectedTool.draw();
    }
  } else {
    alert("it doesn't look like your tool has a draw method!");
  }
}

function mouseReleased() {
  // Handle history
  if (
    insideCanvas() &&
    toolbox.selectedTool.type !== "notSaveInHistory" &&
    mouseButton === LEFT
  ) {
    saveState();
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

function keyPressed(e) {
  if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
    changeHistoryState(-1);
  }
  if (e.keyCode == 89 && (e.ctrlKey || e.metaKey)) {
    changeHistoryState(1);
  }

  if (toolbox.selectedTool.hasOwnProperty("keyPressed")) {
    if (!insideCanvas()) return;

    toolbox.selectedTool.keyPressed(e);
  }
}

function saveState() {
  historyStates.push(get());
  historyIndex = historyStates.length - 1;

  saveDrawing();

  console.log({
    historyStates,
    historyIndex,
  });
}

function changeHistoryState(index) {
  if (
    historyIndex + index < 0 ||
    historyIndex + index > historyStates.length - 1
  ) {
    return;
  }

  historyIndex += index;

  const prevState = historyStates[historyIndex];
  if (!prevState) {
    return;
  }
  background(255);
  image(prevState, 0, 0);

  saveDrawing();

  console.log({
    historyStates,
    historyIndex,
  });
}

function loadCurrentState() {
  const currentState = historyStates[historyIndex];
  if (!currentState) {
    return;
  }
  background(255);
  image(currentState, 0, 0);
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

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function getConfigs() {
  let configs = getLocalStorage("savedConfigs");

  if (!configs) {
    setLocalStorage("savedConfigs", {});
    return {};
  }

  return configs;
}

function getConfig(config, defaultValue = {}) {
  const data = getConfigs();

  if (!data[config]) {
    setConfigs(config, defaultValue);
  }

  return data[config];
}

function setConfigs(config, data) {
  const configs = getConfigs();

  configs[config] = data;

  setLocalStorage("savedConfigs", configs);
}

function saveDrawing() {
  let canvasData = canvas.toDataURL();
  let canvasSize = { width: canvas.width, height: canvas.height };
  let savedDrawing = {
    data: canvasData,
    size: canvasSize,
  };
  setLocalStorage("savedDrawing", savedDrawing);
}

function loadDrawing() {
  let savedDrawing = getLocalStorage("savedDrawing");

  if (savedDrawing) {
    let { data } = savedDrawing;

    background(255);

    loadImage(data, function (img) {
      image(img, 0, 0, width, height); // Draw the loaded image
    });
  } else {
    console.log("No drawing found in local storage!");
  }
}
