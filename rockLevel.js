function setup() {
  createCanvas(960, 540);
  x = 0;
}

function preload() {
  back = loadImage('Assets/Test_Level_Lava.png');
}

function draw() {
  image(back, 0, 0, 960, 540);
}

