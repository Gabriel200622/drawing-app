function SelectTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer"><path d="M12.586 12.586 19 19"/><path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/></svg>`;
  this.name = "selectTool";
  this.type = "notSaveInHistory";
  this.toolKey = ["s"];
  let selectedElement = null;
  let selectedCorner = null;

  const buttonSize = 10;

  this.draw = function () {
    cursor(CROSS);

    this.handleElementReadyToMove();
    this.handleHoverElement();

    if (mouseIsPressed) {
      if (selectedCorner) {
        this.handleResizeElement();
      } else {
        this.handleMoveElement();
      }
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
        if (element.type === "freehand" || element.type === "sprayCan") {
          const { points } = element;

          const dx = mouseX - pmouseX;
          const dy = mouseY - pmouseY;

          const newPoints = points.map((point) => ({
            x: point.x + dx,
            y: point.y + dy,
          }));

          updateElement(element.id, { points: newPoints });
        } else {
          const { posX, posY } = element;

          updateElement(element.id, {
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
