function HelperFunctions() {
  //Jquery click events. Notice that there is no this. at the
  //start we don't need to do that here because the event will
  //be added to the button and doesn't 'belong' to the object

  //event handler for the clear button event. Clears the screen
  let clearButton = select("#clearButton");
  if (clearButton) {
    clearButton.mouseClicked(function () {
      emptyElements();
    });
  }

  //event handler for the save image button. saves the canvsa to the
  //local file system.
  let saveImageButton = select("#saveImageButton");
  if (saveImageButton) {
    saveImageButton.mouseClicked(function () {
      saveCanvas("canvas", "jpg");
    });
  }

  // settings button
  let settingsButton = document.querySelector("#settings_button");
  let settingsButtonContent = document.querySelector(
    "#settings_button_content"
  );

  if (settingsButton && settingsButtonContent) {
    settingsButton.addEventListener("click", function (event) {
      settingsButtonContent.classList.toggle("show");
      event.stopPropagation(); // Evita que el evento se propague al documento
    });

    // detect if the click it's outside of the content, if so closed the menu
    document.addEventListener("click", function (event) {
      if (
        !settingsButtonContent.contains(event.target) &&
        !settingsButton.contains(event.target)
      ) {
        settingsButtonContent.classList.remove("show");
      }
    });
  }

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.display = "block";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
  });

  document.addEventListener("click", function () {
    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.display = "none";
  });

  CanvasBackground();
}

function handleAction(action) {
  switch (action) {
    case "undo":
      undo();
      break;
    case "redo":
      redo();
      break;
    default:
      console.log(`Unknown action ${action}`);
  }
}

// Context menu actions
const undo = () => {
  elements = historyManager.undo(elements);

  deleteGarbageElements();
  saveElements();
};

const redo = () => {
  elements = historyManager.redo(elements);

  deleteGarbageElements();
  saveElements();
};

function toolMousePressed() {
  return mouseIsPressed && mouseButton === LEFT;
}

/**
 *
 * @param {DrawElement} element - The element.
 */
function pointsBasedTool(element) {
  if (
    element.type === "freehand" ||
    element.type === "sprayCan" ||
    element.type === "angleBrush" ||
    element.type === "rainbowBrush"
  )
    return true;

  return false;
}

/**
 * Check if two arrays are deeply equal
 */
function deepEqual(arr1, arr2) {
  // First, check if both are arrays and have the same length
  if (
    !Array.isArray(arr1) ||
    !Array.isArray(arr2) ||
    arr1.length !== arr2.length
  ) {
    return false;
  }

  // Function to compare two values (including objects and arrays)
  function isEqual(val1, val2) {
    if (typeof val1 === "object" && typeof val2 === "object") {
      return deepEqual(val1, val2);
    }
    return val1 === val2;
  }

  // Loop through each element and compare it deeply
  for (let i = 0; i < arr1.length; i++) {
    let el1 = arr1[i];
    let el2 = arr2[i];

    // If elements are objects, check all their fields
    if (typeof el1 === "object" && typeof el2 === "object") {
      const keys1 = Object.keys(el1);
      const keys2 = Object.keys(el2);

      // Check if both objects have the same keys
      if (keys1.length !== keys2.length) {
        return false;
      }

      // Compare all keys and values
      for (let key of keys1) {
        if (!isEqual(el1[key], el2[key])) {
          return false;
        }
      }
    } else if (!isEqual(el1, el2)) {
      return false; // For non-object elements, compare directly
    }
  }

  return true; // If all checks passed, the arrays are equal
}
