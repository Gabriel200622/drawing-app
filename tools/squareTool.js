// SquareTool class definition
function SquareTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;
  this.name = "square";

  var self = this;

  // Indicates this tool uses background color as palette option
  this.backgroundPalette = true;

  // Variables to manage drawing state
  var withStroke = true;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='squareTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='squareTool'> 
      <input checked='' type='checkbox' id='cbx' class='hidden-xs-up'>
      <label for='cbx' class='cbx'></label>`
    );

    // Toggle stroke on checkbox click
    select("#cbx").mouseClicked(function () {
      withStroke = !withStroke;
      self.saveInStorage();
    });

    document
      .getElementById("squareTool")
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
    cursor(CROSS);

    if (this.currentElementId && this.posX && this.posY) {
      upsertElement({
        id: this.currentElementId,
        type: "square",
        posX: this.posX,
        posY: this.posY,
        sizeX: mouseX - this.posX,
        sizeY: mouseY - this.posY,
        bgColor: backgroundP.selectedColour,
        strokeColor: colourP.selectedColour,
        strokeWidth: select("#squareTool").value(),
        stroke: withStroke,
        selected: false,
      });
    }
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

    toolbox.selectTool("selectTool");
  };

  // To save configs
  this.saveInStorage = function () {
    setConfigs(self.name, {
      stroke: select("#cbx").checked() ? true : false,
      size: select("#squareTool").value(),
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { stroke: true, size: 1 });

    if (data) {
      const { stroke, size } = data;
      select("#squareTool").value(size);
      select("#cbx").checked(stroke ? true : false);
      withStroke = stroke;
    }
  };
}
