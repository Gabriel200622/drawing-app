// TextTool class definition
function TextTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`;
  this.name = "text";
  var self = this;
  this.toolKey = ["t"];
  this.input = null;
  this.currentElementId = null;
  this.posX = null;
  this.posY = null;

  this.populateOptions = function (custom) {
    select(".options").html(`
      <label style='color:black;font-size:20px;' for='fontSize'>Font Size</label>
      <input type='range' min='14' max='40' value='14' class='slider' id='fontSize'>  
    `);

    document.getElementById("fontSize").addEventListener("input", function () {
      self.saveInStorage();

      custom?.changeFontSize(document.getElementById("fontSize").value);
    });

    self.loadFromStorage();
  };

  this.draw = function () {
    cursor(CROSS);
  };

  this.mouseReleased = function () {
    isTyping = true;

    this.currentElementId = generateUUID();
    this.posX = mouseX;
    this.posY = mouseY;

    const input = createInput();
    input.position(this.posX, this.posY);
    input.elt.classList.add(`textToolInput-${this.currentElementId}`);
    input.elt.focus();

    upsertElement({
      id: this.currentElementId,
      type: "text",
      posX: this.posX,
      posY: this.posY,
      sizeX: 150,
      sizeY: 50,
      strokeColor: colourP.selectedColour,
      selected: false,
      focus: true,
      fontSize: select("#fontSize").value(),
    });

    toolbox.selectTool("selectTool");
  };

  // To save configs
  this.saveInStorage = function () {
    setConfigs(self.name, {
      fontSize: document.getElementById("fontSize").value,
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { size: 1 });

    if (data) {
      const { fontSize } = data;
      document.getElementById("fontSize").value = fontSize;
    }
  };
}
