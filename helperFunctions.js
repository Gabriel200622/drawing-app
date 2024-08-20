function HelperFunctions() {
  //Jquery click events. Notice that there is no this. at the
  //start we don't need to do that here because the event will
  //be added to the button and doesn't 'belong' to the object

  //event handler for the clear button event. Clears the screen
  let clearButton = select("#clearButton");
  if (clearButton) {
    clearButton.mouseClicked(function () {
      background(255, 255, 255);
      loadPixels();
      saveState();
    });
  }

  //event handler for the save image button. saves the canvsa to the
  //local file system.
  let saveImageButton = select("#saveImageButton");
  if (saveImageButton) {
    saveImageButton.mouseClicked(function () {
      saveCanvas("myPicture", "jpg");
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
}

function handleAction(action) {
  console.log(`You selected ${action}`);

  const contextMenu = document.getElementById("contextMenu");

  contextMenu.style.display = "none";
}

function toolMousePressed() {
  return mouseIsPressed && mouseButton === LEFT;
}
