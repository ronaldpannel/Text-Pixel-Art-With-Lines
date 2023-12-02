/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

let particleArray = [];
let adjustX = 3;
let adjustY = -21;

let pointer = {
  x: undefined,
  y: undefined,
  radius: 50,
};
let hue = 0;
let frameRate = 0;

canvas.addEventListener("pointermove", function (e) {
  pointer.x = e.x;
  pointer.y = e.y;
  pointer.radius = 100;
});
canvas.addEventListener("pointerleave", function (e) {
  pointer.x = undefined
  pointer.y = undefined
  
});

ctx.fillStyle = "white";
ctx.font = "20px Verdana";
ctx.fillText("B", 0, 40);

const textCoordinates = ctx.getImageData(0, 0, 200, 200);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "hsl(" + hue + ",50%,50%)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    // this.hue = Math.random() * 255;
    let dx = pointer.x - this.x;
    let dy = pointer.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = pointer.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < pointer.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 5;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 5;
      }
    }
  }
}

function init() {
  particleArray = [];

  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 30, positionY * 30));
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
  }
  frameRate++;
  if (frameRate % 50 == 0) {
    hue = Math.random() * 255;
  }

  connect();
  requestAnimationFrame(animate);
}
animate();

function connect() {
  let opacity = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacity = 1 - distance / 60;
      ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
      if (distance < 60) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "hsl(" + hue + ",50%,50%)";
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}
