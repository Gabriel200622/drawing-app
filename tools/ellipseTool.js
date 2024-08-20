// EllipseTool class definition
function EllipseTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>`;
  this.name = "ellipse";

  var self = this;

  // Variables to manage drawing state
  var drawEllipse = false;
  var start_X = -1;
  var start_Y = -1;
  var withStroke = true;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='circleTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='circleTool'> 
      <input checked='' type='checkbox' id='cbx' class='hidden-xs-up'>
      <label for='cbx' class='cbx'></label>`
    );

    // Toggle stroke on checkbox click
    select("#cbx").mouseClicked(function () {
      withStroke = !withStroke;
      self.saveInStorage();
    });

    document
      .getElementById("circleTool")
      .addEventListener("change", function () {
        self.saveInStorage();
      });

    self.loadFromStorage();
  };

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);
    var strokeColor = colourP.selectedColour;
    var fillColor = backgroundP.selectedColour;
    stroke(strokeColor);
    fill(fillColor);

    var strokeW = select("#circleTool").value();
    strokeWeight(strokeW);

    if (toolMousePressed()) {
      // Start drawing the ellipse on mouse press
      if (start_X === -1) {
        start_X = mouseX;
        start_Y = mouseY;
        drawEllipse = true;
        loadPixels();
      } else {
        updatePixels();
        if (!withStroke) {
          noStroke();
        }
        ellipse(start_X, start_Y, mouseX - start_X, mouseY - start_Y);
      }
    } else if (drawEllipse) {
      // Finalize the ellipse drawing on mouse release
      loadPixels();
      drawEllipse = false;
      start_X = -1;
      start_Y = -1;
    }
  };

  // Enable background color selection for this tool
  this.backgroundPalette = true;

  this.saveInStorage = function () {
    setConfigs(self.name, {
      stroke: select("#cbx").checked() ? true : false,
      size: select("#circleTool").value(),
    });
  };
  this.loadFromStorage = function () {
    const data = getConfig(self.name, { stroke: true, size: 1 });

    if (data) {
      const { stroke, size } = data;
      select("#circleTool").value(size);
      select("#cbx").checked(stroke ? true : false);
      withStroke = stroke;
    }
  };
}
