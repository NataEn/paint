const Canvas = {};
Canvas.canvasElement = document.querySelector("#canvas");
Canvas.pointerState = "";
Canvas.eventOnPixel = "";
Canvas.colors = ["#ff0000", "#08d800", "#0402c7", "#fc88c7"];
Canvas.pointerState = "";
Canvas.optionButtonsElement = document.querySelector("#optionButtons");
Canvas.options = [
  { button: "pencile", icon: "fw icon" },
  { button: "erasor", icon: "fw icon" },
  { button: "bucket", icon: "fw icon" },
  { button: "clear", icon: "fw icon" },
  { button: "shape", icon: "fw icon" }
];
Canvas.pixels = [];
Canvas.pickedColor = "";
Canvas.shape;
Canvas.pickedShape = "square";
Canvas.shapes = [];

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
    li.appendChild(button);
    colorPallet.append(li);
    li.addEventListener("click", () => {
      console.log("clicked on color " + color);
      Canvas.pickedColor = color;
      console.log("pickedColor", Canvas.pickedColor);
    });
  }
};
Canvas.createOptionButtons = () => {
  const optionButtons = document.querySelector("#optionButtons");
  for (const option of Canvas.options) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.setAttribute("id", option.button);
    button.innerHTML = option.button;
    button.addEventListener("click", event => {
      Canvas.pointerState = event.target.id;
      console.log("pickebutton", Canvas.pointerState);
      Canvas.handelState();
    });
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
  Canvas.pixels.push(pixel);
};
Canvas.erasePixel = () => {
  for (pixel of Canvas.pixels) {
    pixel.addEventListener("mousemove", Canvas.removePixel, true);
  }
};
Canvas.removePixel = event => {
  Canvas.canvasElement.removeChild(event.target);
};
Canvas.clearCanvas = () => {
  for (const pixel of Canvas.pixels) {
    Canvas.canvasElement.removeChild(pixel);
  }
};

Canvas.bindButtonsToOptions = () => {
  const bucketBtn = document.querySelector("#bucket");
  const clearBtn = document.querySelector("#clear");
  const brushSizeBtn = document.querySelector("#brushSize");
  const pencileBtn = document.querySelector("#pencile");
  bucketBtn.addEventListener("click", Canvas.setBucketPointerState, true);
  pencileBtn.addEventListener("click", Canvas.setPencilePointerState, true);
  clearBtn.addEventListener("click", Canvas.clearCanvas);
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
Canvas.handelShapeCreation = event => {
  if (event.type == "mousedown") {
    console.log("mouse down event was fired");
    let x = event.clientX,
      y = event.clientY;
    Canvas.shape = document.createElement("div");
    Canvas.shape.classList = `shape`;
    Canvas.shape.style.border = "1px solid black";
    Canvas.shape.style.backgroundColor = Canvas.pickedColor;
    Canvas.shape.style.position = "absolute";
    Canvas.shape.style.top = y + "px";
    Canvas.shape.style.left = x + "px";
    Canvas.shape.setAttribute("data-type", `${Canvas.pickedShape}`);
    Canvas.canvasElement.appendChild(Canvas.shape);
    document.getElementsByTagName("html")[0].style.cursor = "grab";
    //add event listener to right click to erase shape
  } else if (event.type == "mousemove") {
    console.log("mouse move event was fired");
    let x = event.clientX,
      y = event.clientY;
    if (Canvas.shape) {
      Canvas.shape.style.width =
        x - Number.parseInt(Canvas.shape.style.left) + "px";
      Canvas.shape.style.height =
        y - Number.parseInt(Canvas.shape.style.top) + "px";
    }
    console.log(Canvas.shape);
  } else if (event.type == "mouseup") {
    console.log("mouse up event was fired");
    if (Canvas.shape) {
      Canvas.shape = null;
      document.getElementsByTagName("html")[0].style.cursor = "default";
    }
    Canvas.canvasElement.removeEventListener(
      "mousemove",
      Canvas.handelShapeCreation,
      true
    );
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
    Canvas.pointerState == "erasor"
  ) {
    Canvas.canvasElement.addEventListener("mousedown", e => {
      console.log("mousedown event is on");
      Canvas.pointerState == "pencile"
        ? (eventOnPixel = Canvas.drawPixel)
        : (eventOnPixel = Canvas.erasePixel);
      console.log("event on pixel is", Canvas.drawPixel);
      Canvas.canvasElement.addEventListener("mousemove", eventOnPixel, true);
    });
    Canvas.canvasElement.addEventListener("mouseup", e => {
      console.log("removed evet on mouse move");
      Canvas.canvasElement.removeEventListener("mousemove", eventOnPixel, true);
    });
  } else if (Canvas.pointerState == "clear") {
    console.log("erasor is adding eventlistener");
    Canvas.canvasElement.style.background = "white";
  } else if (Canvas.pointerState == "shape") {
    console.log("a shape is created");
    let shape;
    Canvas.shape = shape;
    Canvas.canvasElement.addEventListener(
      "mousedown",
      Canvas.handelShapeCreation,
      true
    );

    Canvas.canvasElement.addEventListener(
      "mousemove",
      Canvas.handelShapeCreation,
      true
    );
    Canvas.canvasElement.addEventListener(
      "mouseup",
      Canvas.handelShapeCreation,
      true
    );
  }
};

Canvas.start();
