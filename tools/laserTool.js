function LaserTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>`;
  this.name = "laser";
  var previousMouseX = -1;
  var previousMouseY = -1;
  var points = [];
  var laserDuration = 400; // (in ms)
  this.type = "notSaveInHistory";

  this.draw = function () {
    push();
    stroke(255, 0, 0);
    strokeWeight(3);

    if (toolMousePressed()) {
      if (previousMouseX == -1) {
        previousMouseX = mouseX;
        previousMouseY = mouseY;
      } else {
        line(previousMouseX, previousMouseY, mouseX, mouseY);
        points.push({
          x1: previousMouseX,
          y1: previousMouseY,
          x2: mouseX,
          y2: mouseY,
          time: millis(),
        });
        previousMouseX = mouseX;
        previousMouseY = mouseY;
      }
    } else {
      previousMouseX = -1;
      previousMouseY = -1;
    }

    // Clear the screen each frame
    clear();

    // Draw the points stored in the array
    for (let i = points.length - 1; i >= 0; i--) {
      let point = points[i];
      if (millis() - point.time > laserDuration) {
        points.splice(i, 1); // Remove the point if it has been there for more than 1 second
      } else {
        line(point.x1, point.y1, point.x2, point.y2);
      }
    }

    pop();
  };
}
