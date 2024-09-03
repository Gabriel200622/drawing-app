function ImageTool() {
  this.icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
  this.name = "imageTool";
  var self = this;
  this.toolKey = ["i"];

  this.currentElementId = null;
  this.posX = null;
  this.posY = null;
  this.sizeX = null;
  this.sizeY = null;
  this.imageUrl = null;
  this.editingImg = false;

  this.populateOptions = function () {
    select(".options").html(`
    `);
  };

  this.setup = function () {
    const imageInput = document.getElementById("imageInput");
    imageInput.addEventListener("change", (e) => {
      const file = imageInput.files[0]; // Get the first (and only) file

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Image loaded, get its dimensions
            const width = img.width;
            const height = img.height;

            // Initialize image properties
            this.currentElementId = generateUUID();
            this.posX = mouseX;
            this.posY = mouseY;
            this.sizeX = width / 4; // Set default size (scaled down)
            this.sizeY = height / 4; // Set default size (scaled down)
            this.imageUrl = e.target.result; // Set image URL
            this.editingImg = true; // Flag to indicate editing mode
          };
          img.src = e.target.result; // Load image from data URL
        };
        reader.readAsDataURL(file); // Read file as Data URL
      }
    });
  };

  this.draw = function () {
    cursor(CROSS);

    // Add the image to the elements array
    if (
      this.currentElementId &&
      this.posX &&
      this.posY &&
      this.sizeX &&
      this.sizeY &&
      this.imageUrl &&
      this.editingImg
    ) {
      upsertElement({
        id: this.currentElementId,
        type: "image",
        posX: mouseX,
        posY: mouseY,
        sizeX: this.sizeX,
        sizeY: this.sizeY,
        selected: false,
        imageUrl: this.imageUrl,
        editingImg: true,
      });
    }
  };

  this.mousePressed = function () {
    this.editingImg = false;

    upsertElement({
      id: this.currentElementId,
      editingImg: false,
    });

    toolbox.selectTool("selectTool");
  };

  this.onIconClick = function () {
    const imageInput = document.getElementById("imageInput");
    imageInput.click();
  };
}
