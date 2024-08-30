// EraserTool class definition
function EraserTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`;
  this.name = "eraserTool";
  this.color = 255;
  this.toDeleteElements = [];
  this.toolKey = ["e", "0"];
  this.eraserSize = 50;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(``);
  };

  // Method to handle the erasing logic
  this.draw = function () {
    this.drawEraserCursor();
    this.handleDeletingElements();

    this.toDeleteElements.forEach((e) => {
      updateElement(e.id, { deleting: true });
    });
  };

  this.handleDeletingElements = function () {
    const { elements } = hoveringElements();

    if (mouseIsPressed) {
      elements.forEach((e) => {
        this.toDeleteElements.push(e);
      });
    }
  };

  this.mouseReleased = function () {
    this.toDeleteElements.map((e) => {
      deleteElement(e.id);
    });
    this.toDeleteElements = [];
  };

  this.drawEraserCursor = function () {
    push();
    noCursor();
    stroke(0);
    strokeWeight(1.2);
    noFill();

    ellipse(mouseX, mouseY, this.eraserSize / 2, this.eraserSize / 2);
    pop();
  };
}
