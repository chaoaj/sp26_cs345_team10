let projectiles = []; // holds the projectiles being shot
let player_x = 300;
let player_y = 300; // this can be changed when the player class is ready

  
function rockDraw() {
  image(metal_back, 0, 0, 960, 540);
  // debug stuff
  circle(player_x, player_y, 50); // temporary character 
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].display();

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 0)
    }
  }
}

function mousePressed() {
  projectiles.push(new Projectile(player_x, player_y, mouseX, mouseY));
}

