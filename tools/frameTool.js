function FrameTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-frame"><line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/></svg>`;
  this.name = "frame";
  this.toolKey = "f";
  var self = this;
  this.currentElementId = null;
  this.posX = null;
  this.posY = null;

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(``);
  };

  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.posX && this.posY) {
      upsertElement({
        id: this.currentElementId,
        type: "frame",
        posX: this.posX,
        posY: this.posY,
        sizeX: mouseX - this.posX,
        sizeY: mouseY - this.posY,
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
}
