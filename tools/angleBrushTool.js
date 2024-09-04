function AngleBrushTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>`;
  this.name = "angleBrush";
  this.toolKey = ["8"];
  this.currentElementId = null;
  this.points = [];
  var self = this;

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='angleBrushTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='angleBrushTool'>`
    );

    document
      .getElementById("angleBrushTool")
      .addEventListener("input", function () {
        self.saveInStorage();

        custom?.changeStrokeWidth(select("#angleBrushTool").value());
      });

    self.loadFromStorage();
  };

  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.points.length > 0) {
      upsertElement({
        id: this.currentElementId,
        type: "angleBrush",
        posX: this.posX,
        posY: this.posY,
        strokeColor: colourP.selectedColour,
        strokeWidth: select("#angleBrushTool").value(),
        selected: false,
        points: this.points,
      });
    }
  };

  this.mouseDragged = function () {
    if (this.currentElementId) {
      // Add point as mouse is dragged
      const times = 70;

      for (let i = 0; i <= times - 1; i++) {
        this.addPoint(
          lerp(mouseX, pmouseX, i / times),
          lerp(mouseY, pmouseY, i / times)
        );
      }
    }
  };

  this.mousePressed = function () {
    this.currentElementId = generateUUID();
    this.points = [];
    this.addPoint(mouseX, mouseY);
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
    const minDistance = 5;

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
      size: document.getElementById("angleBrushTool").value,
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { size: 1 });

    if (data) {
      const { size } = data;
      document.getElementById("angleBrushTool").value = size;
    }
  };
}
