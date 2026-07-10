# 🌅 Synthetic Dawn - Interactive Poster

A brutalist, interactive bitmap poster built with vanilla JavaScript and the HTML5 Canvas API.

## ✨ Features
- **Procedural Pixelation:** Uses JavaScript to dynamically sample and recreate any uploaded image as a chunky, retro bitmap grid.
- **Hover Physics:** Pixels act like physical keyboard keys, depressing and shrinking slightly as the mouse hovers over them to simulate 3D depth.
- **Interactive Ripples:** Left-clicking triggers expanding wave physics that push the pixels downward in a 360-degree radius.

## 🚀 How to Run Locally
Because this project uses the Canvas API to read image data, it must be run on a local server to prevent browser CORS (Cross-Origin) security blocks.

1. Clone this repository to your local machine.
2. Open the folder in VS Code.
3. Install the **Live Server** extension by Ritwick Dey.
4. Right-click on `index.html` and select **"Open with Live Server"**.

## 🛠️ Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- HTML5 `<canvas>` API