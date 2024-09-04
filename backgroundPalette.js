function BackgroundPalette() {
  this.mainColours = ["white", "orange", "green", "yellow"];
  this.secondaryColours = [
    "silver",
    "gray",
    "pink",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "black",
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
        `.backgroundPaletteContainer ${self.selectedColour}Swatch`
      );
    } else {
      selectedSwatch = $(
        `.backgroundPaletteContainer #${self.selectedColour}Swatch`
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

    var c = this.id().split("Swatch")[0];

    self.selectedColour = c;

    this.style("border", "2px solid blue");

    setConfigs("backgroundColor", { color: c });

    self.callSelectTool(c);
  };

  this.callSelectTool = function (c) {
    const selectTool = toolbox.tools.find((tool) => tool.name === "selectTool");
    selectTool.onColorChange({ bgColor: c });
  };

  this.loadMainColours = function () {
    fill(this.mainColours[0]);
    stroke(this.mainColours[0]);

    for (var i = 0; i < this.mainColours.length; i++) {
      var colourID = this.mainColours[i] + "Swatch";

      var colourSwatch = createDiv();
      colourSwatch.class("colourSwatches");
      colourSwatch.id(colourID);

      select(".backgroundPalette").child(colourSwatch);
      colourSwatch.style("background-color", this.mainColours[i]);
      colourSwatch.mouseClicked(colourClick);
    }
  };

  this.loadSecondaryColours = function () {
    for (var i = 0; i < this.secondaryColours.length; i++) {
      var colourID = this.secondaryColours[i] + "Swatch";

      var colourSwatch = createDiv();
      colourSwatch.class("colourSwatches");
      colourSwatch.id(colourID);

      var menu = document.querySelector(
        ".backgroundPaletteContainer .paletteMenuOpen .paletteColors"
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
      // fill(this.value());
      // stroke(this.value());

      setConfigs("backgroundColor", { color: this.value() });

      self.callSelectTool(this.value());
    });

    var menu = document.querySelector(
      ".backgroundPaletteContainer .paletteMenuOpen .paletteBottom"
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
        ".backgroundPaletteContainer .paletteMenuOpen"
      );
      if (menu) {
        menu.classList.toggle("show");
      }

      event.stopPropagation();
    });

    var backgroundPaletteSeparator = createDiv();
    backgroundPaletteSeparator.class("paletteSeparator");

    select(".backgroundPalette").child(backgroundPaletteSeparator);
    select(".backgroundPalette").child(menuButton);

    document.addEventListener("click", function (event) {
      var menu = document.querySelector(
        ".backgroundPaletteContainer .paletteMenuOpen"
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
    const backgroundColor = getConfig("backgroundColor", {
      color: this.mainColours[0],
    });

    if (backgroundColor) {
      this.selectedColour = backgroundColor.color;
      const button = $(
        `.backgroundPaletteContainer #${self.selectedColour}Swatch`
      );
      if (button) {
        button["0"].style.border = "2px solid blue";
      }
      fill(backgroundColor.color);
      stroke(backgroundColor.color);
    }
  };

  this.loadMainColours();
  this.loadSecondaryColours();
  this.loadColorPicker();
  this.loadMenuButton();
}
