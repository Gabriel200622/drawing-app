function RainbowBrushTool() {
  this.icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_3)"><path d="M9.31371 10.927L17.3837 2.86702C17.6468 2.59546 17.9612 2.37896 18.3088 2.23013C18.6563 2.08129 19.03 2.00309 19.4081 2.00009C19.7861 1.99709 20.161 2.06934 20.5109 2.21263C20.8608 2.35593 21.1786 2.5674 21.446 2.83475C21.7133 3.10209 21.9248 3.41995 22.0681 3.76982C22.2114 4.11969 22.2836 4.49457 22.2806 4.87264C22.2776 5.2507 22.1994 5.62439 22.0506 5.97194C21.9018 6.31949 21.6853 6.63396 21.4137 6.89702L13.3537 14.977" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><g clip-path="url(#clip1_1_3)"><path d="M10.6707 22.3848C11.921 21.1345 12.6234 19.4388 12.6234 17.6707C12.6234 15.9026 11.921 14.2069 10.6707 12.9567C9.42049 11.7064 7.72479 11.0041 5.95669 11.0041C4.18858 11.0041 2.49288 11.7064 1.24264 12.9567" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.12826 14.8423C3.8784 14.0922 4.89582 13.6707 5.95669 13.6707C7.01755 13.6707 8.03497 14.0922 8.78511 14.8423C9.53526 15.5924 9.95669 16.6099 9.95669 17.6707C9.95669 18.7316 9.53526 19.749 8.78511 20.4992" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.01388 16.7279C5.26392 16.4779 5.60306 16.3374 5.95669 16.3374C6.31031 16.3374 6.64945 16.4779 6.89949 16.7279C7.14954 16.978 7.29002 17.3171 7.29002 17.6707C7.29002 18.0244 7.14954 18.3635 6.89949 18.6135" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g><defs><clipPath id="clip0_1_3"><rect width="24" height="24" fill="white"/></clipPath><clipPath id="clip1_1_3"><rect width="16" height="16" fill="white" transform="translate(8.31371 4) rotate(45)"/></clipPath></defs></svg>`;
  this.name = "rainbowBrush";
  var self = this;
  this.currentElementId = null;
  this.points = [];
  this.toolKey = "9";

  // Method to add tool options to the UI
  this.populateOptions = function (custom) {
    select(".options").html(
      `<label for='${self.name}Size'>Marker Size</label>
      <input type='range' min='1' max='15' value='1' class='slider' id='${self.name}Size'>`
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

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);

    if (this.currentElementId && this.points.length > 0) {
      upsertElement({
        id: this.currentElementId,
        type: "rainbowBrush",
        points: this.points,
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
        this.pointColor(x, y);
      }
    } else {
      // If no points exist, add the first point without checking distance
      this.pointColor(x, y);
    }
  };

  this.pointColor = function (x, y) {
    const times = 5;

    colorMode(HSB);
    const strokeColorHsb = color((times * frameCount) % 360, 40, 100);

    colorMode(RGB);
    const strokeColor = color(strokeColorHsb.levels);

    this.points.push({ x, y, color: strokeColor.levels });
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
