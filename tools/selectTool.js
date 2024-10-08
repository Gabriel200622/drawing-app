function SelectTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer"><path d="M12.586 12.586 19 19"/><path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/></svg>`;
  this.name = "selectTool";
  this.type = "notSaveInHistory";
  this.toolKey = ["s"];
  let selectedElement = null;
  let selectedCorner = null;
  this.backgroundPalette = true;

  const buttonSize = 10;

  this.draw = function () {
    cursor(CROSS);

    this.handleElementReadyToMove();
    this.handleHoverElement();
    this.populateCurrentElementOptions();

    if (mouseIsPressed) {
      if (selectedCorner) {
        this.handleResizeElement();
      } else {
        this.handleMoveElement();
      }
    }
  };

  this.onColorChange = function (color) {
    const selectedElements = elements.filter((element) => element.selected);

    if (selectedElements.length > 0) {
      selectedElements.forEach((element) => {
        if (element.selected) {
          upsertElement({
            id: element.id,
            strokeColor: color.strokeColor ?? element.strokeColor,
            bgColor: color.bgColor ?? element.bgColor,
          });
        }
      });
    }
  };

  this.populateCurrentElementOptions = function () {
    const selectedElements = elements.filter((element) => element.selected);

    if (selectedElements.length > 0) {
      const currentElement = selectedElements[0];

      if (currentElement.selected) {
        const tool = toolbox.tools.find((t) => t.name === currentElement.type);

        if (!tool?.populateOptions) {
          select(".options").html(``);
        }

        tool?.populateOptions({
          toggleStroke: (s) => {
            upsertElement({
              id: currentElement.id,
              stroke: s,
            });
          },
          changeStrokeWidth: (st) => {
            upsertElement({
              id: currentElement.id,
              strokeWidth: st,
            });
          },
          changeFontSize: (fs) => {
            upsertElement({
              id: currentElement.id,
              fontSize: fs,
            });
          },
        });
      } else {
        select(".options").html(``);
      }
    } else {
      select(".options").html(``);
    }
  };

  this.handleElementReadyToMove = function () {
    const { elements } = hoveringElements();

    const readyToMove = elements.some((e) => e.selected);
    if (readyToMove && !selectedCorner) cursor(MOVE);
  };

  this.handleHoverElement = function () {
    const { elements } = hoveringElements();

    if (elements.length > 0) {
      cursor(MOVE);
    }
  };

  this.mousePressed = function () {
    selectedElement = elements.find((element) => element.selected);
    if (selectedElement) {
      selectedCorner = this.detectSelectedCorner(selectedElement);
    }
    if (!selectedCorner) {
      handleElementsSelection();
    }

    const { elements: hElements } = hoveringElements();
    if (hElements.length === 0) {
      elements.forEach((element) => {
        if (element.type === "text") {
          inputUnfocus(element);
        }
      });
    }
  };

  this.mouseReleased = function () {
    selectedCorner = null;
  };

  this.handleMoveElement = function () {
    elements.forEach((element) => {
      if (element.selected && !selectedCorner) {
        if (element.type === "frame") {
          const {
            posX: frameX,
            posY: frameY,
            sizeX: frameWidth,
            sizeY: frameHeight,
          } = element;

          // Calculate the movement delta
          const dx = mouseX - pmouseX;
          const dy = mouseY - pmouseY;

          // Move the frame
          upsertElement({
            id: element.id,
            posX: frameX + dx,
            posY: frameY + dy,
          });

          // Find and move all elements inside the frame
          elements.forEach((childElement) => {
            // Check if the element is points-based
            if (pointsBasedTool(childElement)) {
              const { points } = childElement;

              // Check if any point is inside the frame
              const isInsideFrame = points.some(
                (point) =>
                  point.x >= frameX &&
                  point.y >= frameY &&
                  point.x <= frameX + frameWidth &&
                  point.y <= frameY + frameHeight
              );

              if (isInsideFrame) {
                // Move points-based elements
                const newPoints = points.map((point) => ({
                  x: point.x + dx,
                  y: point.y + dy,
                  color: point.color ?? undefined,
                }));

                upsertElement({ id: childElement.id, points: newPoints });
              }
            } else {
              // For regular elements, check if the entire element is inside the frame
              const { posX, posY, sizeX, sizeY } = childElement;
              const isInsideFrame =
                posX >= frameX &&
                posY >= frameY &&
                posX + sizeX <= frameX + frameWidth &&
                posY + sizeY <= frameY + frameHeight;

              if (isInsideFrame) {
                // Move non-points-based elements
                upsertElement({
                  id: childElement.id,
                  posX: posX + dx,
                  posY: posY + dy,
                });
              }
            }
          });
        } else if (pointsBasedTool(element)) {
          // Move points-based elements that are not inside a frame
          const { points } = element;

          const dx = mouseX - pmouseX;
          const dy = mouseY - pmouseY;

          const newPoints = points.map((point) => ({
            x: point.x + dx,
            y: point.y + dy,
            color: point.color ?? undefined,
          }));

          upsertElement({ id: element.id, points: newPoints });
        } else {
          // Move other elements that are not inside a frame
          const { posX, posY } = element;

          upsertElement({
            id: element.id,
            posX: posX + (mouseX - pmouseX),
            posY: posY + (mouseY - pmouseY),
          });
        }
      }
    });
  };

  this.handleResizeElement = function () {
    if (!selectedElement) return;

    const { posX, posY, sizeX, sizeY } = selectedElement;

    let newPosX = posX;
    let newPosY = posY;
    let newSizeX = sizeX;
    let newSizeY = sizeY;

    // Handle resizing from the top-left corner
    if (selectedCorner === "top-left") {
      newSizeX = sizeX + (posX - mouseX);
      newSizeY = sizeY + (posY - mouseY);
      newPosX = mouseX;
      newPosY = mouseY;
    }
    // Handle resizing from the top-right corner
    else if (selectedCorner === "top-right") {
      newSizeX = mouseX - posX;
      newSizeY = sizeY + (posY - mouseY);
      newPosY = mouseY;
    }
    // Handle resizing from the bottom-left corner
    else if (selectedCorner === "bottom-left") {
      newSizeX = sizeX + (posX - mouseX);
      newSizeY = mouseY - posY;
      newPosX = mouseX;
    }
    // Handle resizing from the bottom-right corner
    else if (selectedCorner === "bottom-right") {
      newSizeX = mouseX - posX;
      newSizeY = mouseY - posY;
    }

    // Ensure that the size and position are correct if sizeX or sizeY becomes negative
    if (newSizeX < 0) {
      newSizeX = Math.abs(newSizeX);
      newPosX = newPosX - newSizeX;
    }

    if (newSizeY < 0) {
      newSizeY = Math.abs(newSizeY);
      newPosY = newPosY - newSizeY;
    }

    updateElement(selectedElement.id, {
      posX: newPosX,
      posY: newPosY,
      sizeX: newSizeX,
      sizeY: newSizeY,
    });
  };

  this.detectSelectedCorner = function (element) {
    const { posX, posY, sizeX, sizeY } = element;

    const selectedBoxMargin = 5;

    // Adjust position based on whether sizeX or sizeY are negative
    const adjustedPosX = sizeX < 0 ? posX + sizeX : posX;
    const adjustedPosY = sizeY < 0 ? posY + sizeY : posY;
    const adjustedSizeX = Math.abs(sizeX);
    const adjustedSizeY = Math.abs(sizeY);

    const corners = {
      "top-left": {
        x: adjustedPosX - selectedBoxMargin,
        y: adjustedPosY - selectedBoxMargin,
      },
      "top-right": {
        x: adjustedPosX + adjustedSizeX + selectedBoxMargin,
        y: adjustedPosY - selectedBoxMargin,
      },
      "bottom-left": {
        x: adjustedPosX - selectedBoxMargin,
        y: adjustedPosY + adjustedSizeY + selectedBoxMargin,
      },
      "bottom-right": {
        x: adjustedPosX + adjustedSizeX + selectedBoxMargin,
        y: adjustedPosY + adjustedSizeY + selectedBoxMargin,
      },
    };

    for (const corner in corners) {
      const { x, y } = corners[corner];
      if (
        mouseX >= x - buttonSize / 2 &&
        mouseX <= x + buttonSize / 2 &&
        mouseY >= y - buttonSize / 2 &&
        mouseY <= y + buttonSize / 2
      ) {
        return corner;
      }
    }

    return null;
  };

  this.doubleClicked = function () {
    const { elements } = hoveringElements();

    elements.forEach((element) => {
      if (element.type === "text") {
        inputFocus(element);
      }
    });
  };
}
