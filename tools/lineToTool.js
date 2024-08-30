//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the
//pixel array.
function LineToTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;
  this.name = "lineTo";
  var self = this;
  this.currentElementId = null;
  this.posX = null;
  this.posY = null;
  this.toolKey = "5";

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='lineTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='lineTool'>`
    );

    document.getElementById("lineTool").addEventListener("change", function () {
      self.saveInStorage();
    });

    self.loadFromStorage();
  };

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.posX && this.posY) {
      upsertElement({
        id: this.currentElementId,
        type: "lineTo",
        posX: this.posX,
        posY: this.posY,
        sizeX: mouseX - this.posX,
        sizeY: mouseY - this.posY,
        strokeColor: colourP.selectedColour,
        selected: false,
        strokeWidth: select("#lineTool").value(),
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
      size: select("#lineTool").value(),
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { stroke: true, size: 1 });

    if (data) {
      const { stroke, size } = data;

      select("#lineTool").value(size);
    }
  };
}
