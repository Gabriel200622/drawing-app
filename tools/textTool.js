// TextTool class definition
function TextTool() {
  // SVG icon and tool name
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`;
  this.name = "text";

  // Variable to store text content
  var textContent = "";

  // Method to populate options in the UI
  this.populateOptions = function () {
    select(".options").html(`
      <label for="textInput">Enter text:</label>
      <input type="text" id="textInput" placeholder="Type your text here...">
      <div>
        <button id="enterTextBtn">Enter</button>
      </div>

      <label>Preview:</label>
      <p id="textInputPreview"></p>
    `);

    // Event listener for the enter button to capture text input
    select("#enterTextBtn").mouseClicked(function () {
      // Get text input and update preview
      var textBox = select("#textInput");
      textContent = textBox.value();
      textBox.value(""); // Clear input field
      select("#textInputPreview").html(textContent); // Set preview
    });
  };

  // Method to handle drawing text on mouse release
  this.mouseReleased = function () {
    if (textContent) {
      textSize(32);
      stroke(255);
      strokeWeight(4);
      fill(0);
      text(textContent, mouseX, mouseY); // Draw text at mouse position
    }
  };

  // Empty draw method since drawing happens on mouse release
  this.draw = function () {};
}
