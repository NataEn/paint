const Canvas = {};
Canvas.canvasElement = document.querySelector("#canvas");
Canvas.pointerState = "";
Canvas.lastPointer = "";
Canvas.possiblePointerStates = [
  "pencile",
  "erasor",
  "square",
  "circle",
  "clear"
];
Canvas.eventOnCanvas = "";
Canvas.colors = [
  "#FF5450",
  "#08d800",
  "#6FE886",
  "#5844FF",
  "#5E84EB",
  "#FF64CE",
  "#FA8A10",
  "#6C6A80",
  "#192040",
  "#478059",
  "#EEF6E4",
  "#FAF690"
];
Canvas.optionButtonsElement = document.querySelector("#optionButtons");
Canvas.options = [
  { button: "pencile", icon: "fas fa-pencil-alt" },
  { button: "erasor", icon: "fas fa-eraser" },
  { button: "bucket", icon: "fas fa-fill" },
  { button: "clear", icon: "far fa-trash-alt" },
  { button: "square", icon: "shape fas fa-square" },
  { button: "circle", icon: "shape fas fa-circle" },
  { button: "save", icon: "fas fa-save" },
  { button: "load", icon: "fas fa-save" }
];

Canvas.pixels = [];
Canvas.savedPixels = { pixels: [] };
Canvas.pickedColor = "";
Canvas.shape;
Canvas.shapes = [];
Canvas.savedShapes = { shapes: [] };
Canvas.pickedShape = "square";
Canvas.storeLocaly;
Canvas.storage = window.localStorage;

Canvas.start = () => {
  Canvas.createColorButtons();
  Canvas.createOptionButtons();
  Canvas.bindButtonsToOptions();
  Canvas.handelState();
};
Canvas.createColorButtons = () => {
  const colorPallet = document.querySelector("#colorPallet");
  for (const color of Canvas.colors) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.setAttribute("class", "color");
    button.setAttribute("id", color);
    button.style.background = color;
    li.addEventListener("click", () => {
      const bucketBtn = document.querySelector("#bucket");
      const pencileBtn = document.querySelector("#pencile");
      const shapeBtns = document.querySelectorAll(".shape");
      Canvas.pickedColor = color;
      pencileBtn.style.color = color;
      bucketBtn.style.color = color;
      for (const shape of shapeBtns) {
        shape.style.color = color;
      }
    });
    li.appendChild(button);
    colorPallet.append(li);
  }
};
Canvas.createOptionButtons = () => {
  const optionButtons = document.querySelector("#optionButtons");
  for (const option of Canvas.options) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.setAttribute("class", option.icon);
    button.setAttribute("id", option.button);
    button.setAttribute("title", option.button);
    button.addEventListener(
      "click",
      event => {
        Canvas.pointerState = event.target.id;
        if (
          !Canvas.lastPointer ||
          Canvas.lastPointer.id == Canvas.pointerState
        ) {
          event.target.classList.add("active");
        } else {
          Canvas.lastPointer.classList.remove("active");
          event.target.classList.add("active");
        }
        Canvas.lastPointer = event.target;
        Canvas.handelState();
      },
      false
    );
    li.setAttribute("data-option", option.button);
    li.appendChild(button);
    optionButtons.append(li);
  }
};

Canvas.drawPixel = event => {
  console.log(Canvas.pickedColor);
  const x = event.clientX;
  const y = event.clientY;
  const pixel = document.createElement("div");
  pixel.style.background = Canvas.pickedColor;
  pixel.style.width = "5px";
  pixel.style.height = "5px";
  pixel.style.top = `${y}px`;
  pixel.style.left = `${x}px`;
  pixel.classList = "pixel";
  Canvas.canvasElement.appendChild(pixel);
  Canvas.pixels = document.querySelectorAll(".pixel");
  Canvas.savedPixels.pixels.push({
    width: pixel.style.width,
    top: pixel.style.top,
    left: pixel.style.left,
    color: pixel.style.background,
    classList: "pixel"
  });
};
Canvas.erasePixel = () => {
  console.log("erasor is firing");
  for (pixel of Canvas.pixels) {
    pixel.addEventListener("mousemove", Canvas.removePixel, true);
  }
};
Canvas.removePixel = event => {
  if (Canvas.pointerState === "erasor") {
    Canvas.canvasElement.removeChild(event.target);
  }
};
Canvas.clearCanvas = () => {
  for (const pixel of Canvas.pixels) {
    Canvas.canvasElement.removeChild(pixel);
  }
  Canvas.shapes = Canvas.canvasElement.querySelectorAll(".shape");
  for (const shape of Canvas.shapes) {
    Canvas.canvasElement.removeChild(shape);
  }
};

Canvas.bindButtonsToOptions = () => {
  const brushSizeBtn = document.querySelector("#brushSize");
};

Canvas.changeCanvasColor = () => {
  console.log("entered changeCanvasColor");
  Canvas.canvasElement.style.background = Canvas.pickedColor;
};
Canvas.createDiagonal = event => {
  const x = event.clientX;
  const y = event.clientY;
  const shape = document.createElement("div");
};
Canvas.createInitialShape = () => {
  let x = event.clientX,
    y = event.clientY;
  Canvas.shape = document.createElement("div");
  Canvas.shape.classList = `shape ${Canvas.pointerState}`;
  Canvas.shape.style.backgroundColor = Canvas.pickedColor;
  Canvas.shape.style.top = y + "px";
  Canvas.shape.style.left = x + "px";
  Canvas.shape.setAttribute("data-type", `${Canvas.pointerState}`);
  Canvas.canvasElement.appendChild(Canvas.shape);
  console.log("from create shape", Canvas.shape, `${Canvas.shape}`);
};
Canvas.updateShape = () => {
  let x = event.clientX,
    y = event.clientY;
  if (Canvas.shape) {
    Canvas.shape.style.width =
      x - Number.parseInt(Canvas.shape.style.left) + "px";
    Canvas.shape.style.height =
      y - Number.parseInt(Canvas.shape.style.top) + "px";
  }
};
Canvas.storeLocaly = () => {
  const shapes = Canvas.savedShapes;
  const pixels = Canvas.savedPixels;
  Canvas.storage.setItem("pixels", JSON.stringify(pixels));
  Canvas.storage.setItem("shapes", JSON.stringify(shapes));
};
Canvas.load = () => {
  Canvas.clearCanvas();
  Canvas.storage = localStorage;
  const pixels = JSON.parse(Canvas.storage.getItem("pixels"));
  console.log(pixels.pixels);
  for (const storedpixel of pixels.pixels) {
    const pixel = document.createElement("div");
    pixel.style.background = storedpixel.color;
    pixel.style.width = storedpixel.width;
    pixel.style.height = storedpixel.width;
    pixel.style.top = storedpixel.top;
    pixel.style.left = storedpixel.left;
    pixel.classList = storedpixel.classList;
    Canvas.canvasElement.appendChild(pixel);
  }
  const shapes = JSON.parse(Canvas.storage.getItem("shapes"));
  console.log(shapes);
  for (const storedshape of shapes.shapes) {
    const shape = document.createElement("div");
    shape.style.background = storedshape.color;
    shape.style.width = storedshape.width;
    shape.style.height = storedshape.height;
    shape.style.top = storedshape.top;
    shape.style.left = storedshape.left;
    shape.classList = storedshape.classList;
    Canvas.canvasElement.appendChild(shape);
  }
};

Canvas.handelState = () => {
  console.log("entered handel state function");
  if (Canvas.pointerState == "bucket") {
    console.log("bucket is adding eventlistener");
    Canvas.canvasElement.addEventListener("click", Canvas.changeCanvasColor, {
      once: true
    });
  } else if (
    Canvas.pointerState == "pencile" ||
    Canvas.pointerState == "erasor" ||
    Canvas.pointerState == "square" ||
    Canvas.pointerState == "circle"
  ) {
    Canvas.canvasElement.addEventListener("mousedown", e => {
      if (Canvas.pointerState == "pencile") {
        Canvas.eventOnCanvas = Canvas.drawPixel;
      } else if (Canvas.pointerState == "erasor") {
        Canvas.eventOnCanvas = Canvas.erasePixel;
      } else if (
        Canvas.pointerState == "square" ||
        Canvas.pointerState == "circle"
      ) {
        Canvas.createInitialShape();
        Canvas.eventOnCanvas = Canvas.updateShape;
      }
      Canvas.canvasElement.addEventListener(
        "mousemove",
        Canvas.eventOnCanvas,
        true
      );
    });
    Canvas.canvasElement.addEventListener("mouseup", e => {
      Canvas.canvasElement.removeEventListener(
        "mousemove",
        Canvas.eventOnCanvas,
        true
      );
      if (Canvas.shape) {
        Canvas.savedShapes.shapes.push({
          width: Canvas.shape.style.width,
          height: Canvas.shape.style.height,
          top: Canvas.shape.style.top,
          left: Canvas.shape.style.left,
          color: Canvas.shape.style.backgroundColor,
          classList: Object.values(Canvas.shape.classList).join(" ")
        });
        Canvas.shape = null;
      }
    });
  } else if (Canvas.pointerState == "clear") {
    event.target.classList.remove("active");
    Canvas.clearCanvas();
    Canvas.canvasElement.style.background = "white";
  } else if (Canvas.pointerState == "save") {
    Canvas.storeLocaly();
  } else if (Canvas.pointerState == "load") {
    Canvas.load();
  }
};

Canvas.start();
