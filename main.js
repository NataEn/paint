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
  { button: "clear", icon: "fw icon" }
];
Canvas.pixels = [];

Canvas.pickedColor = "";

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

Canvas.handelState = () => {
  console.log("entered handel state function");
  console.log(Canvas.drawPixel);
  console.log(Canvas.pointerState);
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

// Canvas.bindCanvasStateToButtons = () => {
//   const pencile = document.querySelector("#pencile");
//   const erasor = document.querySelector("#erasor");
// };
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

Canvas.start();
