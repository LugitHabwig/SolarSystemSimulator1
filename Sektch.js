let planets = [];
const G = 6.67430e-11;
const AU = 1.496e11;
const SCALE = 250 / 1.5e11;
let timeStep = 86400; // Ein Tag in Sekunden
let paused = false;

function setup() {
  let canvas = createCanvas(1200, 800);
  canvas.parent('canvas-container');
  
  planets.push(new Planet("Sonne", 1.989e30, 0, 0, 0, color(255, 255, 0)));
  planets.push(new Planet("Merkur", 3.285e23, 0.387 * AU, 0.206, 7.0, color(169, 169, 169)));
  planets.push(new Planet("Venus", 4.867e24, 0.723 * AU, 0.007, 3.4, color(255, 198, 73)));
  planets.push(new Planet("Erde", 5.972e24, 1.000 * AU, 0.017, 0.0, color(100, 149, 237)));
  planets.push(new Planet("Mars", 6.39e23, 1.524 * AU, 0.093, 1.9, color(188, 39, 50)));
  planets.push(new Planet("Jupiter", 1.898e27, 5.203 * AU, 0.048, 1.3, color(255, 165, 0)));
  planets.push(new Planet("Saturn", 5.683e26, 9.537 * AU, 0.054, 2.5, color(238, 232, 170)));
  planets.push(new Planet("Uranus", 8.681e25, 19.191 * AU, 0.047, 0.8, color(173, 216, 230)));
  planets.push(new Planet("Neptun", 1.024e26, 30.069 * AU, 0.009, 1.8, color(0, 0, 255)));
}

function draw() {
  background(0);
  translate(width/2, height/2);
  
  if (!paused) {
    for (let planet of planets) {
      planet.update(planets, timeStep);
    }
  }
  
  for (let planet of planets) {
    planet.show();
  }
  
  // Anzeige der Steuerungsinformationen
  resetMatrix();
  fill(255);
  textSize(12);
  text("Leertaste: Pause/Fortsetzen", 10, height - 60);
  text("Pfeiltasten rechts/links: Zeit beschleunigen/verlangsamen", 10, height - 40);
  text("Pfeiltasten oben/unten: Vorwärts/Rückwärts in der Zeit", 10, height - 20);
}

function keyPressed() {
  if (key === ' ') {
    paused = !paused;
  } else if (keyCode === RIGHT_ARROW) {
    timeStep *= 2;
  } else if (keyCode === LEFT_ARROW) {
    timeStep /= 2;
  } else if (keyCode === UP_ARROW) {
    timeStep = abs(timeStep);
  } else if (keyCode === DOWN_ARROW) {
    timeStep = -abs(timeStep);
  }
}

class Planet {
  constructor(name, mass, a, e, i, col) {
    this.name = name;
    this.mass = mass;
    this.a = a;
    this.e = e;
    this.i = radians(i);
    this.col = col;
    this.pos = createVector();
    this.vel = createVector();
    this.initOrbit();
  }

  initOrbit() {
    if (this.a === 0) return; // Sonne
    let r = this.a * (1 - this.e);
    let speed = sqrt(G * 1.989e30 * (2 / r - 1 / this.a));
    this.pos = createVector(r * cos(this.i), r * sin(this.i), 0);
    this.vel = createVector(-speed * sin(this.i), speed * cos(this.i), 0);
  }

  update(planets, dt) {
    if (this.a === 0) return; // Sonne bewegt sich nicht
    let acceleration = createVector(0, 0, 0);
    for (let other of planets) {
      if (other !== this) {
        let r = p5.Vector.sub(other.pos, this.pos);
        let forceMagnitude = G * this.mass * other.mass / r.magSq();
        acceleration.add(r.normalize().mult(forceMagnitude / this.mass));
      }
    }
    this.vel.add(acceleration.mult(dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  show() {
    fill(this.col);
    noStroke();
    circle(this.pos.x * SCALE, this.pos.y * SCALE, max(2, log(this.mass) - 23));
    fill(255);
    textSize(10);
    text(this.name, this.pos.x * SCALE + 10, this.pos.y * SCALE + 10);
  }
}