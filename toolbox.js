// Container object for storing the tools. Functions to add new tools and select a tool
function Toolbox() {
  var self = this;

  this.tools = [];
  this.selectedTool = null;

  var toolbarItemClick = function () {
    var toolName = this.id().split("toolboxItem")[0];
    self.selectTool(toolName);

    //call loadPixels to make sure most recent changes are saved to pixel array
    loadPixels();
  };

  //add a new tool icon to the html page
  var addToolIcon = function (icon, name) {
    var toolboxItem = createDiv(icon);
    toolboxItem.class("toolboxItem");
    toolboxItem.id(name + "toolboxItem");
    toolboxItem.parent("toolbox");
    toolboxItem.mouseClicked(toolbarItemClick);
  };

  //add a tool to the tools array
  this.addTool = function (tool) {
    // check that the object tool has an icon and a name
    if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
      alert("make sure your tool has both a name and an icon");
    }
    this.tools.push(tool);
    addToolIcon(tool.icon, tool.name);
  };

  this.selectTool = function (toolName) {
    // search through the tools for one that's name matches
    for (var i = 0; i < this.tools.length; i++) {
      if (this.tools[i].name == toolName) {
        // remove any existing borders
        let items = document.querySelectorAll(".toolboxItem");
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove("selected");
        }

        // if the tool has an unselectTool method run it.
        if (
          this.selectedTool != null &&
          this.selectedTool.hasOwnProperty("unselectTool")
        ) {
          this.selectedTool.unselectTool();
        }
        // select the tool and highlight it on the toolbar
        this.selectedTool = this.tools[i];

        // Add a class to the sidebar item
        var toolboxItem = document.querySelector(
          "#" + toolName + "toolboxItem"
        );
        if (toolboxItem) {
          toolboxItem.classList.add("selected");
        }

        //if the tool has an options area. Populate it now.
        if (this.selectedTool.hasOwnProperty("populateOptions")) {
          this.selectedTool.populateOptions();
        } else {
          select(".options").html(``);
        }

        if (this.selectedTool.hasOwnProperty("backgroundPalette")) {
          $(".backgroundPaletteContainer").removeClass("hide");
        } else {
          $(".backgroundPaletteContainer").addClass("hide");
        }

        setConfigs("selectedTool", toolName);
      }
    }
  };

  this.keyPressed = function (e) {
    // Handle keys to select a tool
    this.tools.forEach((tool) => {
      if (tool.toolKey) {
        // If the tool key is an array, check all keys
        if (Array.isArray(tool.toolKey)) {
          tool.toolKey.forEach((key) => {
            const keyCode = charToKeyCode(key);
            if (e.keyCode === keyCode) {
              this.selectTool(tool.name);
            }
          });
        } else {
          const keyCode = charToKeyCode(tool.toolKey);

          if (e.keyCode === keyCode) {
            this.selectTool(tool.name);
          }
        }
      }
    });
  };
}
