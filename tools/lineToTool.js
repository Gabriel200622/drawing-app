//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the
//pixel array.
function LineToTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;
  this.name = "LineTo";

  var startMouseX = -1;
  var startMouseY = -1;
  var drawing = false;

  this.populateOptions = function () {
    select(".options").html(
      "<label style='color:black;font-size:20' for='lineToSize'>Line Size</label> <input type='range' min='1' max='25' value='1' class='slider' id='lineToSize'>"
    );
  };

  // draws the line to the screen
  this.draw = function () {
    push();
    var size = document.getElementById("lineToSize").value;
    strokeWeight(size);

    if (toolMousePressed()) {
      cursor(CROSS);
      if (startMouseX == -1) {
        startMouseX = mouseX;
        startMouseY = mouseY;
        drawing = true;
        // Load and save pixels array of the canvas
        loadPixels();
      } else {
        updatePixels();
        line(startMouseX, startMouseY, mouseX, mouseY);
      }
    } else if (drawing) {
      drawing = false;
      startMouseX = -1;
      startMouseY = -1;
    }

    pop();
  };
}
