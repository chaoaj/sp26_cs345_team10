
/*
======================================
---------- Game Variables ------------
======================================
*/

// Variable for keeping track of the game state (level)
// 0 = Menu
// 1 = LoFi
// 2 = EDM
// 3 = Rock
// 4 = Transitioning (?)
let levelRender = 0; 

// Screen size
const CANVAS_HEIGHT = 960;
const CANVAS_WIDTH = 540;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game assets
function preload() {
    // Main menu
    menuBacking = loadImage('../Assets/menu_lava.png');
    menuMusic = loadSound('../Assets/Music/Fire_Ah_PlaceHolder.mp3'); // change file path when we have the actual menu music
    menuLargeBg = loadImage('../Assets/menu_background.png');

    // Metal level
    metal_back = loadImage('../Assets/Test_Level_Lava.png');
    rockMusic = loadSound('../Assets/Music/Terrible_Placeholder_Music.mp3');
}

function setup() {
    createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
    playLevelMusic();
}

function draw() {
    switch (levelRender) {
        case 0:
            menuDraw();
            break;
        case 3:
            rockDraw();
            break;
        default:
            break;
    }
}


/*
======================================
------- Function Declarations --------
======================================
*/

/**
 * Plays the music track for the appropriate level (or main menu).
 */
function playLevelMusic() {
    if (levelMusic != undefined)
        levelMusic.stop();
    switch (levelRender) {
        case 0:
            levelMusic = menuMusic;
            break;
        case 3:
            levelMusic = rockMusic;
            break;
        default:
            levelMusic = menuMusic;
            break;
    }
    levelMusic.play();
    levelMusic.setVolume(0.3); // change the volume between 0.0 and 1.0 if needed
    userStartAudio();
}
