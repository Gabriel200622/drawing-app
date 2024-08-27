// EllipseTool class definition
function EllipseTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>`;
  this.name = "ellipse";

  var self = this;

  // Variables to manage drawing state
  var drawEllipse = false;
  var start_X = -1;
  var start_Y = -1;
  var withStroke = true;

  // Enable background color selection for this tool
  this.backgroundPalette = true;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='circleTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='circleTool'> 
      <input checked='' type='checkbox' id='cbx' class='hidden-xs-up'>
      <label for='cbx' class='cbx'></label>`
    );

    // Toggle stroke on checkbox click
    select("#cbx").mouseClicked(function () {
      withStroke = !withStroke;
      self.saveInStorage();
    });

    document
      .getElementById("circleTool")
      .addEventListener("change", function () {
        self.saveInStorage();
      });

    self.loadFromStorage();
  };

  this.currentElementId = null;
  this.posX = null;
  this.posY = null;

  // Method to handle the drawing logic
  this.draw = function () {
    if (this.currentElementId && this.posX && this.posY) {
      upsertElement({
        id: this.currentElementId,
        type: "ellipse",
        posX: this.posX,
        posY: this.posY,
        sizeX: mouseX - this.posX,
        sizeY: mouseY - this.posY,
        bgColor: backgroundP.selectedColour,
        strokeColor: colourP.selectedColour,
        strokeWidth: select("#circleTool").value(),
        stroke: withStroke,
        selected: false,
      });
    }

    cursor(CROSS);
  };

  this.mousePressed = function () {
    this.currentElementId = generateUUID();
    this.posX = mouseX;
    this.posY = mouseY;
  };

  this.mouseReleased = function () {
    updateElement(this.currentElementId, { selected: true });

    this.currentElementId = null;
    this.posX = null;
    this.posY = null;
  };

  // To save configs
  this.saveInStorage = function () {
    setConfigs(self.name, {
      stroke: select("#cbx").checked() ? true : false,
      size: select("#circleTool").value(),
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { stroke: true, size: 1 });

    if (data) {
      const { stroke, size } = data;
      select("#circleTool").value(size);
      select("#cbx").checked(stroke ? true : false);
      withStroke = stroke;
    }
  };
}
