function rockSetup() {
  player_1 = new Player(player_x, player_y);
  projectiles = [];
  player_ani = new Sprite(spriteData, spritesheet, 0.1);
}

function rockDraw() {
  image(metal_back, 0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
  player_1.update();
  player_1.draw();
  player_ani.show(player_1.x, player_1.y);
  player_ani.animate();
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
    }
  }

}
