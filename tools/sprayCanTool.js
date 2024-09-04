// SprayCanTool class definition
function SprayCanTool() {
  // Tool name and SVG icon
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-spray-can"><path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/></svg>`;
  this.name = "sprayCan";
  var self = this;
  this.currentElementId = null;
  this.points = [];
  this.toolKey = "7";

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(
      `<label for='freehandSize'>Points size</label>
      <input type='range' min='1' max='15' value='1' class='slider' id='pointsSize'>`
    );

    document
      .getElementById("pointsSize")
      .addEventListener("input", function () {
        self.saveInStorage();

        custom?.changeStrokeWidth(document.getElementById("pointsSize").value);
      });

    self.loadFromStorage();
  };

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.points.length > 0) {
      upsertElement({
        id: this.currentElementId,
        type: "sprayCan",
        points: this.points,
        strokeColor: colourP.selectedColour,
        strokeWidth: select("#pointsSize").value(),
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
      this.addPoint(mouseX, mouseY);
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
    const nPoints = 8;
    const spread = 20;

    for (let i = 0; i < nPoints; i++) {
      this.points.push({
        x: random(x - spread, x + spread),
        y: random(y - spread, y + spread),
      });
    }
  };

  // To save configs
  this.saveInStorage = function () {
    setConfigs(self.name, {
      pointsSize: document.getElementById("pointsSize").value,
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { pointsSize: 1 });

    if (data) {
      const { pointsSize } = data;
      document.getElementById("pointsSize").value = pointsSize;
    }
  };
}
