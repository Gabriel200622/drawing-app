function CanvasBackground() {
  const bgColorsContainer = document.querySelector(".bg_colors_container");

  BG_COLORS.map((color) => {
    const bgColorDiv = document.createElement("button");
    bgColorDiv.classList.add(`bg_color_${color.color}`);
    bgColorDiv.style.backgroundColor = color.color;
    bgColorDiv.addEventListener("click", () => {
      backgroundColor = color.color;
      setConfigs("canvasBackground", { color: backgroundColor });
    });

    bgColorsContainer.appendChild(bgColorDiv);
  });

  const savedCanvasBackground = getConfig("canvasBackground", {
    color: BG_COLORS[0].color,
  });
  if (savedCanvasBackground) {
    backgroundColor = savedCanvasBackground.color;
  }
}
