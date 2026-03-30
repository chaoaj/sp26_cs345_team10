let menuMusic; // music

function setup() {
  createCanvas(960, 540);
  x = 0;
  backGroundMusic();
}

function preload() {
  menuBacking = loadImage('Assets/menu_lava.png');
  menuMusic = loadSound('Assets/Music/Fire_Ah_PlaceHolder.mp3'); // change file path when we have the actual menu music
}

function draw() {
  background(220);
  image(menuBacking, 160, -90, 650, 700);
  startButton();
  levelButton();
  tutorialButton();
  settingsButton();
}

function backGroundMusic() {
  menuMusic.play();
  menuMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
  userStartAudio();
}

function startButton() {
  fill("red");
  rect(360, 180 - 50, 240, 60); // the minus 50 was for when the menu asset was placed and the buttons were adjusted
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Start", 480, 215 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 180 - 50 && mouseY <= 240 - 50 &&
     mouseIsPressed == true) {
    console.log("Start");
    window.location.href = 'rockLevel.html'; // this moves to the test level right now
  }
}
  
  function levelButton() {
  level = ["Story Mode", "Arcade Mode", "Chao Mode"];
  fill("red");
  rect(360, 260 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text(level[x], 480, 295 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 260 - 50 && mouseY <= 320 - 50 &&
     mouseIsPressed == true) {
    if (x == 2) {
      x = 0;
      mouseIsPressed = false;
    } else {
      x++;
      mouseIsPressed = false;
    }
  }
}

function tutorialButton() {
  fill("red");
  rect(360, 340 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("How To Play", 480, 375 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 340 - 50 && mouseY <= 400 - 50 &&
     mouseIsPressed == true) {
    console.log("How To");
  }
}
  
function settingsButton() {
  fill("red");
  rect(360, 420 - 50, 240, 60);
  
  textSize(20);
  textAlign(CENTER);
  fill("black");
  text("Settings", 480, 455 - 50);
  
  if (mouseX >= 360 && mouseX <= 600 &&
     mouseY >= 420 - 50 && mouseY <= 480 - 50 &&
     mouseIsPressed == true) {
    console.log("Settings");
  }
}