// FreehandTool class definition
function FreehandTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
  this.name = "freehand";
  var self = this;
  this.currentElementId = null;
  this.points = [];
  this.toolKey = "6";

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(
      `<label for='freehandSize'>Marker Size</label>
      <input type='range' min='1' max='15' value='1' class='slider' id='freehandSize'>`
    );

    document
      .getElementById("freehandSize")
      .addEventListener("input", function () {
        self.saveInStorage();

        custom?.changeStrokeWidth(
          document.getElementById("freehandSize").value
        );
      });

    self.loadFromStorage();
  };

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.points.length > 0) {
      upsertElement({
        id: this.currentElementId,
        type: "freehand",
        points: this.points,
        strokeColor: colourP.selectedColour,
        strokeWidth: select("#freehandSize").value(),
        selected: false,
      });
    }
  };

  this.mousePressed = function () {
    this.currentElementId = generateUUID();
    this.points = [];
    this.addPoint(mouseX, mouseY);
  };

  this.mouseDragged = function () {
    if (this.currentElementId) {
      this.addPoint(mouseX, mouseY); // Add point as mouse is dragged
    }
  };

  this.mouseReleased = function () {
    updateElement(this.currentElementId, {
      points: this.points,
    });

    this.currentElementId = null;
    this.points = [];
  };

  this.addPoint = function (x, y) {
    // Minimum distance threshold (adjust this value as needed)
    const minDistance = 10;

    // Check if there are any existing points
    if (this.points.length > 0) {
      const lastPoint = this.points[this.points.length - 1];

      // Calculate the distance between the last point and the new point
      const distance = Math.sqrt(
        Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
      );

      // Only add the point if the distance is greater than the threshold
      if (distance >= minDistance) {
        this.points.push({ x, y });
      }
    } else {
      // If no points exist, add the first point without checking distance
      this.points.push({ x, y });
    }
  };

  // To save configs
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
