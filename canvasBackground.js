/**
 * Initializes the canvas background color selector and applies the saved background color.
 * Creates a button for each background color option and attaches event listeners to update
 * the selected background color and save it to the configuration.
 *
 * @function CanvasBackground
 * @description This function populates the background color options on the canvas
 *              and applies the previously saved background color from the configuration.
 *              Each color option is represented by a button, and clicking a button updates
 *              the canvas background color and saves the selection to localStorage.
 */
function CanvasBackground() {
  // Select the container element where the background color buttons will be appended
  const bgColorsContainer = document.querySelector(".bg_colors_container");

  // Iterate over the predefined background color options
  BG_COLORS.map((color) => {
    // Create a new button element for each color
    const bgColorDiv = document.createElement("button");
    bgColorDiv.classList.add(`bg_color_${color.color}`);
    bgColorDiv.style.backgroundColor = color.color;

    // Add click event listener to update the background color and save the selection
    bgColorDiv.addEventListener("click", () => {
      backgroundColor = color.color;
      setConfigs("canvasBackground", { color: backgroundColor });
    });

    // Append the newly created button to the container
    bgColorsContainer.appendChild(bgColorDiv);
  });

  // Retrieve the saved canvas background color configuration
  const savedCanvasBackground = getConfig("canvasBackground", {
    color: BG_COLORS[0].color, // Default to the first color if no saved configuration exists
  });

  // Apply the saved background color if available
  if (savedCanvasBackground) {
    backgroundColor = savedCanvasBackground.color;
  }
}
