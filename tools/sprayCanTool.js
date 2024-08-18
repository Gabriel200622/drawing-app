// SprayCanTool class definition
function SprayCanTool() {
  // Tool name and SVG icon
  this.name = "sprayCanTool";
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-spray-can"><path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/></svg>`;

  // Number of points and spread radius for the spray effect
  var points = 13;
  var spread = 10;

  // Method to handle the drawing logic
  this.draw = function () {
    if (mouseIsPressed) {
      // Generate random points within the spread area
      for (var i = 0; i < points; i++) {
        point(
          random(mouseX - spread, mouseX + spread),
          random(mouseY - spread, mouseY + spread)
        );
      }
    }
  };
}
