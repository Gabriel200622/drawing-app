// ArrowTool class definition
function ArrowTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>`;
  this.name = "arrow";

  // Variables to manage drawing state
  var drawArrow = false;
  var start_X = -1;
  var start_Y = -1;
  var noStrokeMode = false;

  // Method to add tool options to the UI
  this.populateOptions = function () {
    select(".options").html(
      `<label style='color:black;font-size:20px;' for='arrowTool'>Stroke width</label> 
      <input type='range' min='4' max='25' value='1' class='slider' id='arrowTool'> 
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
    stroke(strokeColor);
    var strokeW = select("#arrowTool").value();
    strokeWeight(strokeW);

    if (mouseIsPressed) {
      // Start drawing the arrow on mouse press
      if (start_X === -1) {
        start_X = mouseX;
        start_Y = mouseY;
        drawArrow = true;
        loadPixels();
      } else {
        if (noStrokeMode) {
          noStroke();
        }
        updatePixels();
        drawArrowShape(start_X, start_Y, mouseX, mouseY);
      }
    } else if (drawArrow) {
      // Finalize the arrow drawing on mouse release
      loadPixels();
      drawArrow = false;
      start_X = -1;
      start_Y = -1;
    }
  };

  // Helper function to draw the arrow shape
  function drawArrowShape(x1, y1, x2, y2) {
    var angle = atan2(y2 - y1, x2 - x1);
    var headSize = 10;

    // Draw arrow line
    line(x1, y1, x2, y2);

    // Draw arrow head
    push();
    translate(x2, y2);
    rotate(angle);
    beginShape();
    vertex(0, 0);
    vertex(-headSize, headSize / 2);
    vertex(-headSize, -headSize / 2);
    endShape(CLOSE);
    pop();
  }
}
