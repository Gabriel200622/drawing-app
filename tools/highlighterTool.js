function HighlighterTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-highlighter"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>`;
  this.name = "highlighter";
  this.toolKey = "h";
  var self = this;
  this.currentElementId = null;
  this.points = [];

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(
      `<label for='${self.name}Size'>Highlighter Size</label>
      <input type='range' min='10' max='35' value='1' class='slider' id='${self.name}Size'>`
    );

    document
      .getElementById(`${self.name}Size`)
      .addEventListener("input", function () {
        self.saveInStorage();

        custom?.changeStrokeWidth(
          document.getElementById(`${self.name}Size`).value
        );
      });

    self.loadFromStorage();
  };

  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.points.length > 0) {
      upsertElement({
        id: this.currentElementId,
        type: "highlighter",
        points: this.points,
        strokeColor: colourP.selectedColour,
        strokeWidth: select(`#${self.name}Size`).value(),
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
      size: document.getElementById(`${self.name}Size`).value,
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { size: 1 });

    if (data) {
      const { size } = data;
      document.getElementById(`${self.name}Size`).value = size;
    }
  };
}
