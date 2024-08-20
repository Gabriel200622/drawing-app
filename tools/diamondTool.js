// DiamondTool class definition
function DiamondTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-diamond"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>`;
  this.name = "diamond";

  // Variables to manage drawing state
  var drawDiamond = false;
  var start_X = -1;
  var start_Y = -1;
  var noStrokeMode = false;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='diamondTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='diamondTool'> 
      <input checked='' type='checkbox' id='cbx' class='hidden-xs-up'>
      <label for='cbx' class='cbx'></label>`
    );

    // Toggle noStrokeMode on checkbox click
    select("#cbx").mouseClicked(function () {
      noStrokeMode = !noStrokeMode;
    });
  };

  // Method to handle the drawing logic
  this.draw = function () {
    cursor(CROSS);
    var strokeColor = colourP.selectedColour;
    var fillColor = backgroundP.selectedColour;
    fill(fillColor);
    stroke(strokeColor);
    var strokeW = select("#diamondTool").value();
    strokeWeight(strokeW);

    if (toolMousePressed()) {
      // Start drawing the diamond on mouse press
      if (start_X === -1) {
        start_X = mouseX;
        start_Y = mouseY;
        drawDiamond = true;
        loadPixels();
      } else {
        if (noStrokeMode) {
          noStroke();
        }
        updatePixels();
        drawDiamondShape(start_X, start_Y, mouseX, mouseY);
      }
    } else if (drawDiamond) {
      // Finalize the diamond drawing on mouse release
      loadPixels();
      drawDiamond = false;
      start_X = -1;
      start_Y = -1;
    }
  };

  // Helper function to draw the diamond shape
  function drawDiamondShape(x1, y1, x2, y2) {
    var centerX = (x1 + x2) / 2;
    var centerY = (y1 + y2) / 2;
    var width = abs(x2 - x1);
    var height = abs(y2 - y1);

    // Draw diamond shape
    beginShape();
    vertex(centerX, y1);
    vertex(x2, centerY);
    vertex(centerX, y2);
    vertex(x1, centerY);
    endShape(CLOSE);
  }

  // Enable background color selection for this tool
  this.backgroundPalette = true;
}
