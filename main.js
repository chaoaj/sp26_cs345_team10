
/*
======================================
---------- Game Variables ------------
======================================
*/

// Variable for keeping track of the game state (level)
// Possible States
// 0 = menu
// 1 = lofi
// 2 = edm
// 3 = rock
// 4 = trans
let levelRender = 'menu'; 

// Variable to detect if the game is paused
let paused = false;

// Set Screen size
const CANVAS_HEIGHT = 750;
const CANVAS_WIDTH = 1000;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;

// sp26_cs345_team10/Assets loaded in preload()
var menuBacking, menuMusic, menuLargeBg, menuStartButton;
var menuSettingsButton, menuHowToButton, menuStoryButton, menuArcadeButton, menuChaoButton, menuLogoGlow;
var metal_back, rockMusic;
var edm_back;
var spritesheet, spriteData, bullet;

let enemies = [];

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game sp26_cs345_team10/Assets
function preload() {
    // Main menu
    menuBacking = loadImage('sp26_cs345_team10/Assets/menu_lava.png');
    menuMusic = loadSound('sp26_cs345_team10/Assets/Music/Fire_Ah_PlaceHolder.mp3'); // change file path when we have the actual menu music
    menuLargeBg = loadImage('sp26_cs345_team10/Assets/menu_background.png');
    menuStartButton = [loadImage('sp26_cs345_team10/Assets/Buttons/start.png'), loadImage('sp26_cs345_team10/Assets/Buttons/start_select.png')];
    menuSettingsButton = [loadImage('sp26_cs345_team10/Assets/Buttons/settings.png'), loadImage('sp26_cs345_team10/Assets/Buttons/settings_select.png')];
    menuHowToButton = [loadImage('sp26_cs345_team10/Assets/Buttons/how_to_play.png'), loadImage('sp26_cs345_team10/Assets/Buttons/how_to_play_select.png')];
    menuStoryButton = [loadImage('sp26_cs345_team10/Assets/Buttons/story.png'), loadImage('sp26_cs345_team10/Assets/Buttons/story_select.png')];
    menuArcadeButton = [loadImage('sp26_cs345_team10/Assets/Buttons/arcade.png'), loadImage('sp26_cs345_team10/Assets/Buttons/arcade_select.png')];
    menuChaoButton = [loadImage('sp26_cs345_team10/Assets/Buttons/chao.png'), loadImage('sp26_cs345_team10/Assets/Buttons/chao_select.png')];
    menuLogoGlow = loadImage('sp26_cs345_team10/Assets/logo_glow.png');

    // Metal level
    metal_back = loadImage('sp26_cs345_team10/Assets/test_level_lava.png');
    rockMusic = loadSound('sp26_cs345_team10/Assets/Music/Terrible_Placeholder_Music.mp3');

    // EDM level
    edm_back = loadImage('sp26_cs345_team10/Assets/test_level_edm.png');

    // Player 
    spritesheet = loadImage('sp26_cs345_team10/Assets/red_guy_sheet.png');
    spriteData = loadJSON('sp26_cs345_team10/Assets/redguy.json')
    bullet = loadImage('sp26_cs345_team10/Assets/bullet.png')
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noSmooth();
    playLevelMusic();
}

function draw() {
    if (!paused && typeof updateGamepads === "function") {
        updateGamepads();
    }
    switch (levelRender) {
        case 'menu':
            menuDraw();
            break;
        case 'rock':
            rockDraw();
            break;
        case 'edm':
            edmDraw();
            break;
        default:
            break;
    }
    // If the game is paused, draw pause menu overtop the game
    if (levelRender != 'menu' && paused) {
        pauseMenuDraw();
    }
}


/*
======================================
------- Function Declarations --------
======================================
*/

/**
 * Switches current level and re-freshes the music
 */
function switchLevel(levelName) {
    levelRender = levelName;
    if (levelName === 'rock') {
        rockSetup();
    }
    if (levelName == 'edm') { // edm level
        edmSetup();
    }
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
    if (key === 'c') { // added for testing
        switchLevel('edm');
    }
    if (key == 'Escape' && levelRender != 'menu') {
        // Toggle pausing variable
       paused = !paused; 
    }
}

function keyReleased() {
    pressedKeys[key] = false;
}

function mousePressed() {
    if (paused) {
        return;
    }
    if (levelRender === 'rock' || levelRender === 'edm') {
        projectiles.push(new Projectile(player_1.x, player_1.y, mouseX, mouseY, "player"));
    }
}

/**
 * Plays the music track for the appropriate level (or main menu).
 */
function playLevelMusic() {
    if (levelMusic != undefined)
        levelMusic.stop();
    switch (levelRender) {
        case 'menu':
            levelMusic = menuMusic;
            break;
        case 'rock':
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
