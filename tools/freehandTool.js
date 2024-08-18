// FreehandTool class definition
function FreehandTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
  this.name = "freehand";

  var self = this;

  // Variables to manage previous mouse coordinates
  var previousMouseX = -1;
  var previousMouseY = -1;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label for='freehandSize'>Marker Size</label>
      <input type='range' min='1' max='15' value='1' class='slider' id='freehandSize'>`
    );

    document
      .getElementById("freehandSize")
      .addEventListener("change", function () {
        self.saveInStorage();
      });

    self.loadFromStorage();
  };

  // Method to handle the drawing logic
  this.draw = function () {
    push();
    var size = document.getElementById("freehandSize").value;
    strokeWeight(size);

    if (mouseIsPressed) {
      // Initialize previous mouse coordinates on mouse press
      if (previousMouseX == -1) {
        previousMouseX = mouseX;
        previousMouseY = mouseY;
      } else {
        // Draw a line from the previous to the current mouse coordinates
        line(previousMouseX, previousMouseY, mouseX, mouseY);
        previousMouseX = mouseX;
        previousMouseY = mouseY;
      }
    } else {
      // Reset previous mouse coordinates when the mouse is not pressed
      previousMouseX = -1;
      previousMouseY = -1;
    }

    pop();
  };

  this.saveInStorage = function () {
    setConfigs(self.name, {
      size: document.getElementById("freehandSize").value,
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { size: 1 });

    if (data) {
      const { size } = data;
      document.getElementById("freehandSize").value = size;
    }
  };
}
