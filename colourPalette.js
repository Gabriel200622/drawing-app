function ColourPalette() {
  this.mainColours = ["black", "orange", "pink", "yellow"];
  this.secondaryColours = [
    "silver",
    "gray",
    "white",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "navy",
    "blue",
    "teal",
    "aqua",
  ];

  this.selectedColour = this.mainColours[0];

  var self = this;

  var deselectLastSwatch = function () {
    let selectedSwatch;

    if (self.selectedColour.includes("#")) {
      // The selected colour is a hex value
      selectedSwatch = $(
        `.colourPaletteContainer ${self.selectedColour}Swatch`
      );
    } else {
      selectedSwatch = $(
        `.colourPaletteContainer #${self.selectedColour}Swatch`
      );
    }

    if (selectedSwatch.length) {
      selectedSwatch.css({
        border: "0",
      });
    }
  };

  var colourClick = function () {
    deselectLastSwatch();

    //get the new colour from the id of the clicked element
    var c = this.id().split("Swatch")[0];

    //set the selected colour and fill and stroke
    self.selectedColour = c;
    fill(c);
    stroke(c);

    // add a new border to the selected colour
    this.style("border", "2px solid blue");

    setConfigs("strokeColor", { color: c });

    self.callSelectTool(c);
  };

  this.callSelectTool = function (c) {
    const selectTool = toolbox.tools.find((tool) => tool.name === "selectTool");
    selectTool.onColorChange({ strokeColor: c });
  };

  this.loadMainColours = function () {
    fill(this.mainColours[0]);
    stroke(this.mainColours[0]);

    // for each colour create a new div in the html for the colourSwatches
    for (var i = 0; i < this.mainColours.length; i++) {
      var colourID = this.mainColours[i] + "Swatch";

      //using JQuery add the swatch to the palette and set its background colour
      //to be the colour value.
      var colourSwatch = createDiv();
      colourSwatch.class("colourSwatches");
      colourSwatch.id(colourID);

      select(".colourPalette").child(colourSwatch);
      colourSwatch.style("background-color", this.mainColours[i]);
      colourSwatch.mouseClicked(colourClick);
    }
  };

  this.loadSecondaryColours = function () {
    // for each colour create a new div in the html for the colourSwatches
    for (var i = 0; i < this.secondaryColours.length; i++) {
      var colourID = this.secondaryColours[i] + "Swatch";

      var colourSwatch = createDiv();
      colourSwatch.class("colourSwatches");
      colourSwatch.id(colourID);

      var menu = document.querySelector(
        ".colourPaletteContainer .paletteMenuOpen .paletteColors"
      );
      if (menu) {
        menu.appendChild(colourSwatch.elt);
      }

      colourSwatch.style("background-color", this.secondaryColours[i]);
      colourSwatch.mouseClicked(colourClick);
    }
  };

  this.loadColorPicker = function () {
    var colorPicker = createInput();
    colorPicker.attribute("type", "color");
    colorPicker.attribute("value", this.selectedColour);
    colorPicker.attribute("id", "colourPicker");

    colorPicker.input(function () {
      deselectLastSwatch();

      self.selectedColour = this.value();
      fill(this.value());
      stroke(this.value());

      setConfigs("strokeColor", { color: this.value() });
      self.callSelectTool(this.value());
    });

    var menu = document.querySelector(
      ".colourPaletteContainer .paletteMenuOpen .paletteBottom"
    );
    if (menu != null) {
      menu.appendChild(colorPicker.elt);
    }
  };

  this.loadMenuButton = function () {
    var menuButton = createButton();
    menuButton.class("paletteMenuButton");
    menuButton.html("");

    menuButton.mouseClicked(function (event) {
      var menu = document.querySelector(
        ".colourPaletteContainer .paletteMenuOpen"
      );
      if (menu) {
        menu.classList.toggle("show");
      }

      event.stopPropagation();
    });

    var colourPaletteSeparator = createDiv();
    colourPaletteSeparator.class("paletteSeparator");

    select(".colourPalette").child(colourPaletteSeparator);
    select(".colourPalette").child(menuButton);

    document.addEventListener("click", function (event) {
      var menu = document.querySelector(
        ".colourPaletteContainer .paletteMenuOpen"
      );
      if (menu && menu.classList.contains("show")) {
        var isClickInside =
          menu.contains(event.target) || menuButton.elt.contains(event.target);
        if (!isClickInside) {
          menu.classList.remove("show");
        }
      }
    });
  };

  this.loadSavedColor = function () {
    const strokeColor = getConfig("strokeColor", {
      color: this.mainColours[0],
    });
    if (strokeColor) {
      this.selectedColour = strokeColor.color;
      const button = document.getElementById(`${strokeColor.color}Swatch`);
      if (button) {
        button.style.border = "2px solid blue";
      }
      fill(strokeColor.color);
      stroke(strokeColor.color);
    }
  };

  this.loadMainColours();
  this.loadSecondaryColours();
  this.loadColorPicker();
  this.loadMenuButton();
}
