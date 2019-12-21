const Canvas = {};
Canvas.canvasElement = document.querySelector("#canvas");
Canvas.pointerState = "";
Canvas.possiblePointerStates = ["pencile", "erasor", "shape", "clear"];
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
  { button: "circle", icon: "shape fas fa-circle" }
];
Canvas.pixels = [];
Canvas.pickedColor = "";
Canvas.shape;
Canvas.shapes = [];
Canvas.pickedShape = "square";

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
  console.log("from drawPixel" + event);
  console.log(Canvas.pickedColor);
  const x = event.clientX;
  const y = event.clientY;
  const pixel = document.createElement("div");
  pixel.style.background = Canvas.pickedColor;
  pixel.style.width = "10px";
  pixel.style.height = "10px";
  pixel.style.border = "1px solid black";
  pixel.style.position = "absolute";
  pixel.style.top = `${y}px`;
  pixel.style.left = `${x}px`;
  pixel.style.zIndex = "2";
  pixel.classList = "pixel";
  Canvas.canvasElement.appendChild(pixel);
  Canvas.pixels = document.querySelectorAll(".pixel");
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
  Canvas.shape.style.border = "1px solid black";
  Canvas.shape.style.backgroundColor = Canvas.pickedColor;
  Canvas.shape.style.position = "absolute";
  Canvas.shape.style.top = y + "px";
  Canvas.shape.style.left = x + "px";
  Canvas.shape.setAttribute("data-type", `${Canvas.pointerState}`);
  Canvas.canvasElement.appendChild(Canvas.shape);
  Canvas.shapes = document.querySelectorAll(".shape");
  console.log(Canvas.shape);
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
        Canvas.shape = null;
      }
    });
  } else if (Canvas.pointerState == "clear") {
    console.log("erasor is adding eventlistener");
    Canvas.clearCanvas();
    Canvas.canvasElement.style.background = "white";
  }
};

Canvas.start();
