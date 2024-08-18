// SquareTool class definition
function SquareTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;
  this.name = "square";

  // Variables to manage drawing state
  var drawRect = false;
  var start_X = -1;
  var start_Y = -1;
  var noStrokeMode = false;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='rectangleTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='rectangleTool'> 
      <input checked='' type='checkbox' id='cbx' class='hidden-xs-up'>
      <label for='cbx' class='cbx'></label>`
    );

    // Event listener for the checkbox to toggle stroke mode
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
    var strokeW = select("#rectangleTool").value();
    strokeWeight(strokeW);

    if (mouseIsPressed) {
      // Start drawing the rectangle
      if (start_X === -1) {
        start_X = mouseX;
        start_Y = mouseY;
        drawRect = true;
        loadPixels();
      } else {
        // Update the screen with the saved pixels to hide any previous rectangle
        updatePixels();
        // Draw the rectangle with optional stroke based on mode
        if (noStrokeMode) {
          noStroke();
        }
        rect(start_X, start_Y, mouseX - start_X, mouseY - start_Y);
      }
    } else if (drawRect) {
      // Save the pixels with the final rectangle drawn and reset drawing state
      loadPixels();
      drawRect = false;
      start_X = -1;
      start_Y = -1;
    }
  };

  // Indicates this tool uses background color as palette option
  this.backgroundPalette = true;
}
