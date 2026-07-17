const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const posterWidth = 1400; // Adjusted poster width
const posterHeight = 900; // Adjusted poster height
const pixelSize = 7; // Size of each pixel in the grid

const pixels = [];
const mouse = { x: -1000, y: -1000 }; 

// Array to track active ripples
const ripples = []; 

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Left-click listener for the ripple
window.addEventListener('mousedown', (event) => {
  event.preventDefault(); 
  
  // Spawn a new ripple at the mouse coordinates
  ripples.push({
    x: event.x,
    y: event.y,
    radius: 0, 
    speed: 7, 
    maxRadius: Math.max(window.innerWidth, window.innerHeight) 
  });
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(); 
});

class PixelKey {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.baseY = y; 
    this.color = color;
    this.size = pixelSize;
    this.visualSize = pixelSize - 2; 
  }

  update() {
    let targetY = this.baseY;

    // --- 1. HOVER SINKING LOGIC ---
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const hoverRadius = 40; //change this to adjust the hover effect the appears with the cursor

    if (distance < hoverRadius) {
      const force = (hoverRadius - distance) / hoverRadius;
      targetY = this.baseY + force * 25; 
    }

    // --- 2. RIPPLE LOGIC ---
    for (let i = 0; i < ripples.length; i++) {
      const rx = ripples[i].x - this.x;
      const ry = ripples[i].y - this.y;
      const distToRippleCenter = Math.sqrt(rx * rx + ry * ry);
      
      const distToRing = Math.abs(distToRippleCenter - ripples[i].radius);
      const ringThickness = 10; 

      if (distToRing < ringThickness) {
        const waveForce = (ringThickness - distToRing) / ringThickness;
        targetY += waveForce * 40; 
      }
    }

    // Physics easing
    this.y += (targetY - this.y) * 0.15;
  }

  draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(this.x, this.baseY, this.visualSize, this.visualSize);

    ctx.fillStyle = this.color;
    const depthScale = (this.y - this.baseY) * 0.05;
    
    ctx.fillRect(
      this.x + depthScale, 
      this.y + depthScale, 
      this.visualSize - (depthScale * 2), 
      this.visualSize - (depthScale * 2)
    );
  }
}

function init() {
  pixels.length = 0; 
  ripples.length = 0; 

  const hiddenCanvas = document.createElement('canvas');
  const hCtx = hiddenCanvas.getContext('2d');
  hiddenCanvas.width = posterWidth;
  hiddenCanvas.height = posterHeight;

  const img = new Image();
  img.src = './CR.jpg'; //change the image path to add any picture you want
  
  img.onload = () => {
    hCtx.drawImage(img, 0, 0, posterWidth, posterHeight);
    
    const imageData = hCtx.getImageData(0, 0, posterWidth, posterHeight).data;
    const offsetX = (canvas.width - posterWidth) / 2;
    const offsetY = (canvas.height - posterHeight) / 2;

    for (let y = 0; y < posterHeight; y += pixelSize) {
      for (let x = 0; x < posterWidth; x += pixelSize) {
        const index = (y * posterWidth + x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        const color = `rgb(${r},${g},${b})`;
        
        pixels.push(new PixelKey(x + offsetX, y + offsetY, color));
      }
    }
  };
}

function animate() {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].radius += ripples[i].speed;
    
    if (ripples[i].radius > ripples[i].maxRadius) {
      ripples.splice(i, 1);
    }
  }

  for (let i = 0; i < pixels.length; i++) {
    pixels[i].update();
    pixels[i].draw();
  }

  requestAnimationFrame(animate);
}

init();
animate();