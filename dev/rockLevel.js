let projectiles = [];

function rockSetup() {
  player = new Player(CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2);
  projectiles = [];
}

function rockDraw() {
  image(metal_back, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  player.update();
  player.draw();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (levelRender === 'rock') {
    projectiles.push(new Projectile(player.x, player.y, mouseX, mouseY));
  }
}

