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
// 5 = tutorial
let levelRender = 'menu'; 
let game_mode = 'story';

// Variable to detect if the game is paused
let paused = false;

// Variable to track if game is over
let gameOver = false;
let gameOverMusicPlaying = false;
let gameOverMouseLock = false;

// Tutorial variables
let tutorialIndex = 0;
let tutorialClickFlag = false;
let tutorialMusicPlaying = false;
let showTutorialOverlay = false;
var tutorialImages = []; // Array to hold tutorial images

// End screen variables
let endMusicPlaying = false;
let endScreenMouseLock = false;

// Credits screen variables
let showCredits = false;
let creditsMouseLock = false;
let creditsImage;

// Cooldown variable for menus
let menuCooldownTimer = 0;

// Set Screen size
const CANVAS_HEIGHT = 1500 / 2;
const CANVAS_WIDTH = 2000 / 2;

// p5 sound object for playing in-game music
// See: https://p5js.org/reference/p5.sound/
let levelMusic;
// Game Sound Volumes
let sfx_volume = 0.3;
let music_volume = 0.3;

// assets loaded in preload()
var menuBacking, menuMusic, menuLargeBg, menuStartButton;
var menuSettingsButton, menuHowToButton, menuStoryButton, menuArcadeButton, menuChaoButton, menuLogoGlow;
var returnMenuButton, creditsButton;
var metal_back, rockMusic;
var edm_back, edmMusic;
var lofi_back, lofiMusic;
var spritesheet, spriteData, bullet, bulletData;
var runnerSheet, runnerData; // Edm grunt
var big_bassSheet, big_bassData; // Edm Bomber
var amp_smallSheet, amp_smallData // amp enemy
var disc_throwerData, disc_throwerSheet // disc enemy
var fireballSheet, fireballData; // Fireball projectiles
var eleExplodeSprite, eleExplodeData; // Elemental explosion
var dragonSpriteSheet, dragonJSON // Dragon Boss 
var rave_knightJSON, rave_knightSheet // Rave Boss
var bard_JSON, bard_spriteSheet // Bard boss
var shotgunSprite
var healthBarSheet, healthBarData; // Health bar display
var settingsIconSheet, settingsIconData; // In-game gear/settings button (sprite sheet)
var gameOverImage; // Game over screen image
var gameOverMusic; // Game over music
var pixelFont; // 8-bit style pixel font (supersoft.ttf)
var tutorialMusic; // Tutorial background music
var endScene, endScenePlayer;
var exitItem, healthBox;
var rollJSON, rollspritesheet;
var endMusic;

let enemies = [];
let boss = [];
let items = [];

/** Shared fire rate for mouse and gamepad (ms between shots). */
const PLAYER_FIRE_INTERVAL_MS = 150;
let lastPlayerFireAt = 0;
let laserCooldown = 0;
const LASER_DURATION = 300; 
let firePending = false;

/** In-game settings (gear) button state. */
const IN_GAME_SETTINGS_BTN_X = 15;
const IN_GAME_SETTINGS_BTN_Y = 15;
const IN_GAME_SETTINGS_BTN_SIZE = 50;
let inGameSettingsClickLock = false;
let inGameSettingsHovered = false;

/*
======================================
---------- p5.js core functions ------
======================================
*/

// Pre-load ALL game assets
function preload() {
    // Main menu
    menuBacking = loadImage('assets/gui/menu_lava.png');
    menuMusic = loadSound('assets/music/RythemizerThemeExtended.mp3');
    menuLargeBg = loadImage('assets/gui/menu_background.png');
    menuStartButton = [loadImage('assets/buttons/start.png'), loadImage('assets/buttons/start_select.png')];
    menuSettingsButton = [loadImage('assets/buttons/settings.png'), loadImage('assets/buttons/settings_select.png')];
    menuHowToButton = [loadImage('assets/buttons/how_to_play.png'), loadImage('assets/buttons/how_to_play_select.png')];
    menuStoryButton = [loadImage('assets/buttons/story.png'), loadImage('assets/buttons/story_select.png')];
    menuArcadeButton = [loadImage('assets/buttons/arcade.png'), loadImage('assets/buttons/arcade_select.png')];
    menuChaoButton = [loadImage('assets/buttons/chao.png'), loadImage('assets/buttons/chao_select.png')];
    returnMenuButton = [loadImage('assets/buttons/main_menu.png'), loadImage('assets/buttons/main_menu_select.png')];
    creditsButton = [loadImage('assets/buttons/credits.png'), loadImage('assets/buttons/credits_select.png')];
    menuResumeButton = [loadImage('assets/buttons/resume.png'), loadImage('assets/buttons/resume_select.png')];
    menuLogoGlow = loadImage('assets/gui/logo_glow.png');
    returnMenuLava   = loadImage('assets/gui/return_menu_lava.png');
    returnMenuYes    = [loadImage('assets/buttons/return_menu_yes.png'),    loadImage('assets/buttons/return_menu_yes_select.png')];
    returnMenuNo     = [loadImage('assets/buttons/return_menu_no.png'),     loadImage('assets/buttons/return_menu_no_select.png')];
    
    

    // Metal level
    metal_back = loadImage('assets/levels/Test_Level_Lava.png');
    rockMusic = loadSound('assets/music/Organica - Master of None.mp3');
    dragonJSON = loadJSON('assets/bosses/guitar_dragon_boss.json');
    dragonSpriteSheet = loadImage('assets/bosses/guitar_dragon_boss.png');

    // EDM level
    edm_back = loadImage('assets/levels/test_level_edm.png');
    edmMusic = loadSound('assets/music/ThatsSoRAVEn.mp3');
    rave_knightJSON = loadJSON('assets/bosses/rave_knight.json');
    rave_knightSheet = loadImage('assets/bosses/rave_knight.png');

    // Lofi level
    lofi_back = loadImage('assets/levels/test_level_lofi.png');
    lofiMusic = loadSound('assets/music/LofiCrapIMadeIn20Minutes.mp3');
    bard_JSON = loadJSON('assets/bosses/vibe_bard.json');
    bard_spriteSheet = loadImage('assets/bosses/vibe_bard.png');

    // player 
    spritesheet = loadImage('assets/player/red_guy_sheet.png');
    spriteData = loadJSON('assets/player/redguy.json');
    rollJSON = loadJSON('assets/player/roll_anim.json')
    rollspritesheet = loadImage('assets/player/roll_anim.png')

    // player Bullets
    bullet = loadImage('assets/projectiles/bullet.png');
    bulletData = loadJSON('assets/projectiles/bullet.json');
    fastBullet = loadImage('assets/projectiles/fast_bullet.png');
    fastBulletData = loadJSON('assets/projectiles/fast_bullet.json');
    laserPink = loadImage('assets/projectiles/laser_pink.png');
    laserPinkData = loadJSON('assets/projectiles/laser_pink.json');
    vinylGreen = loadImage('assets/projectiles/vinyl_green_sheet.png');
    vinylGreenData = loadJSON('assets/projectiles/vinyl_green.json');
    vinylPink = loadImage('assets/projectiles/vinyl_pink_sheet.png');
    vinylPinkData = loadJSON('assets/projectiles/vinyl_pink.json');
    vinylBlue = loadImage('assets/projectiles/vinyl_blue_sheet.png');
    vinylBlueData = loadJSON('assets/projectiles/vinyl_blue.json');

    // End Screen
    endScene = loadImage('assets/gui/end_scene-faster.gif');
    endScenePlayer = loadImage('assets/gui/end_scene_player-faster.gif');
    endMusic = loadSound('assets/music/EndGameTheme.mp3')

    // ------ enemies ------ 
    // Runner
    runnerSheet = loadImage('assets/enemies/vinyl_runner.png');
    runnerData = loadJSON('assets/enemies/vinyl_runner.json');
    // Big Bass
    big_bassSheet = loadImage('assets/enemies/big_bass.png');
    big_bassData = loadJSON('assets/enemies/big_bass.json');
    // Disc Thrower
    disc_throwerSheet = loadImage('assets/enemies/disc_thrower.png');
    disc_throwerData = loadJSON('assets/enemies/disc_thrower.json');
    // Small Amp
    amp_smallSheet = loadImage('assets/enemies/small_amp.png');
    amp_smallData = loadJSON('assets/enemies/small_amp.json');
    // Cat Rider
    cat_riderSheet = loadImage('assets/enemies/cat_waverider.png');
    cat_riderData = loadJSON('assets/enemies/cat_waverider.json');
    // Pedal Floater
    pedal_floaterSheet = loadImage('assets/enemies/pedal_floater.png');
    pedal_floaterData = loadJSON('assets/enemies/pedal_floater.json');
    // ---------------------

    // Enemy projectiles
    fireballSheet = loadImage('assets/projectiles/fireball.png');
    fireballData = loadJSON('assets/projectiles/fireball.json');
    quarterNote = loadImage('assets/projectiles/quarter_note.png');
    hypnoWaveSheet = loadImage('assets/projectiles/hypno_wave.png');

    // Elemental explosion
    eleExplodeSprite = loadImage('assets/element_explosion.png');
    eleExplodeData = loadJSON('assets/element_explosion.json'); 
    
    //Fire explosion
    fireExplodeSprite = loadImage('assets/fire_explosion.png');
    fireExplodeData = loadJSON('assets/fire_explosion.json');

    // Guns
    pistolSprite = loadImage('assets/weapons/pistol.png')
    laserSprite = loadImage('assets/weapons/beat_laser.png')
    discThrowerSprite = loadImage('assets/weapons/disc_thrower.png')
    shotgunSprite = loadImage('assets/weapons/shotgun.png')

    // Shield
    shieldSheet = loadImage('assets/player/shield.png')
    shieldData = loadJSON('assets/player/shield.json')
    
    // Health Bar
    healthBarSheet = loadImage('assets/gui/health_bar.png');
    healthBarData = loadJSON('assets/gui/health_bar.json');

    // In-game settings (gear) button
    settingsIconSheet = loadImage('assets/gui/setting.png');
    settingsIconData = loadJSON('assets/gui/setting.json');
    
    // Game Over
    gameOverImage = loadImage('assets/gui/death_screen.png');
    gameOverMusic = loadSound('assets/music/29_Ghosts_IV.mp3');

    // Pixel font used for arcade-style overlays (e.g. wave counter)
    pixelFont = loadFont('assets/gui/pixel-font-supersoft-assets/ttf/supersoft.ttf');

    // items
    healthBox = loadImage('assets/items/health_box.png');
    shieldBox = loadImage('assets/items/shield_box.png');
    shotgunBox = loadImage('assets/items/shotgun_box.png');
    laserBox = loadImage('assets/items/laser_box.png');
    vinylBox = loadImage('assets/items/disc_shooter_box.png');
    exitItem = loadImage('assets/items/end_story_item.png');
    
    // Tutorial images/gif
    tutorialImages[0] = loadImage('assets/gui/tutorial_1.png');
    tutorialImages[1] = loadImage('assets/gui/tutorial_2.png');
    tutorialImages[2] = loadImage('assets/gui/tutorial_3.png');
    tutorialImages[3] = loadImage('assets/gui/tutorial_4.png');
    tutorialGifCreate = createImg('assets/gui/rolling.gif');

    
    // End screen gifs
    playerWalking = loadImage('assets/gui/player_walking.gif');
    endScene = loadImage('assets/gui/end_scene.gif');
    endScenePlayer = loadImage('assets/gui/end_scene_player.gif');

    // Credits
    creditsImage = loadImage('assets/gui/credits.png');

    // Tutorial music
    tutorialMusic = loadSound('assets/music/The_Four_(five)_Of_Us_Are_dying.mp3');

    // --------------sfx---------------
    explosionNormal = loadSound('assets/sfx/sfx_explosionNormal.ogg');
    healthSFX = loadSound('assets/sfx/sfx_health.ogg');
    shockedSFX = loadSound('assets/sfx/sfx_shocked.ogg'); 
    waveClearSFX = loadSound('assets/sfx/sfx_waveclear.ogg');
    selectSFX = loadSound('assets/sfx/sfx_select.ogg');
    toggleSFX = loadSound('assets/sfx/sfx_toggle.ogg');
    rollSFX = loadSound('assets/sfx/sfx_roll.ogg');
}

function setup() {
    const cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // Move the p5 canvas into our flex-centered, letterboxed wrapper.
    cnv.parent('game-container');
    noSmooth();
    fitCanvasToWindow();
    playLevelMusic();
}

/**
 * p5.js callback fired whenever the browser window changes size.
 * We deliberately do NOT call resizeCanvas() here — the drawing buffer
 * (and therefore all game coordinates / physics) must stay at the fixed
 * virtual resolution CANVAS_WIDTH x CANVAS_HEIGHT. Only the on-screen
 * display size changes.
 */
function windowResized() {
    fitCanvasToWindow();
}

/**
 * Scales the canvas's CSS display size so it fits inside the browser
 * window while preserving the game's aspect ratio (uniform scale, no
 * distortion, no cropping). Using Math.min picks the largest scale that
 * still keeps the whole 1000x750 game visible — the unused space on the
 * short side of the window shows through as black letterbox / pillarbox
 * bars from the #game-container background.
 *
 * Game logic is unaffected: createCanvas() still uses the fixed virtual
 * resolution CANVAS_WIDTH x CANVAS_HEIGHT, so all coordinates, physics,
 * and asset positions stay the same.
 *
 * Why CSS width/height instead of `transform: scale()`?
 *   p5.js translates browser mouse positions to canvas-space using
 *   `canvas.scrollWidth / canvas.width` (and the matching height ratio).
 *   CSS transforms do NOT update scrollWidth, so a transform-based scale
 *   would leave mouseX / mouseY reporting raw screen pixels and break
 *   every click target in the game. Setting style.width / style.height
 *   is the canonical p5 approach and keeps mouseX / mouseY in virtual
 *   game coordinates with zero changes to game logic.
 */
function fitCanvasToWindow() {
    const cnvElt = (typeof drawingContext !== 'undefined' && drawingContext && drawingContext.canvas)
        ? drawingContext.canvas
        : document.querySelector('#game-container canvas');
    if (!cnvElt) {
        return;
    }

    const scale = Math.min(
        window.innerWidth / CANVAS_WIDTH,
        window.innerHeight / CANVAS_HEIGHT
    );

    const displayWidth = Math.floor(CANVAS_WIDTH * scale);
    const displayHeight = Math.floor(CANVAS_HEIGHT * scale);

    cnvElt.style.width = displayWidth + 'px';
    cnvElt.style.height = displayHeight + 'px';
}

function draw() {
    if (gameOver) {
        boss_spawned = false;
        edm_boss_spawned = false;
        lofi_boss_spawned = false;
        projectiles = [];
        is_dead = true;
        displayGameOver();
        return;
    }
    
    if (!paused && typeof updateGamepads === "function") {
        updateGamepads();
    }
    if (!paused) {
        handleHeldFire();
        if (laserCooldown > 0) laserCooldown--;
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
        case 'lofi':
            lofiDraw();
            break;
        case 'end':
            endScreenDraw();
            if (showCredits) {
                drawCreditsScreen();
            }
            break
        case 'tutorial':
            displayTutorial();
            break;
        default:
            break;
    }
    // In-game settings button (top-left). Only show during gameplay levels and when
    // the pause menu isn't already up, so it doesn't draw over the pause UI.
    if (isGameplayLevel(levelRender) && !paused) {
        drawInGameSettingsButton();
    } else {
        inGameSettingsHovered = false;
    }

    // If the game is paused, draw pause menu overtop the game
    if (levelRender != 'menu' && paused) {
    pauseMenuDraw();
    if (showTutorialOverlay) {
        displayTutorial();
        }
    }

    // FPS Counter 
    //fpsCounter();
}

/**
 * Returns true when the current level is an active gameplay level
 * (so we can decide whether to show the in-game settings button).
 */
function isGameplayLevel(level) {
    return level === 'rock' || level === 'edm' || level === 'lofi';
}

/**
 * Draws the gear icon button at the top-left of the screen during gameplay.
 * Clicking it pauses the game, which causes pauseMenuDraw() to render the pause menu.
 */
function drawInGameSettingsButton() {
    if (typeof settingsIconSheet === "undefined" || !settingsIconSheet ||
        typeof settingsIconData === "undefined" || !settingsIconData) {
        return;
    }

    const x = IN_GAME_SETTINGS_BTN_X;
    const y = IN_GAME_SETTINGS_BTN_Y;
    const size = IN_GAME_SETTINGS_BTN_SIZE;

    const hovering =
        mouseX >= x && mouseX <= x + size &&
        mouseY >= y && mouseY <= y + size;

    // Hover sfx (only fire once when entering the button)
    if (hovering && !inGameSettingsHovered) {
        if (typeof playSFX === "function") {
            playSFX("hover");
        }
    }
    inGameSettingsHovered = hovering;

    // Pick a sprite frame: idle vs hovered/pressed.
    const frames = settingsIconData.frames;
    let frameIndex = 0;
    if (hovering) {
        frameIndex = mouseIsPressed ? 2 : 1;
    }
    if (frameIndex >= frames.length) {
        frameIndex = frames.length - 1;
    }
    const frame = frames[frameIndex].position;

    push();
    imageMode(CORNER);
    image(
        settingsIconSheet,
        x, y,
        size, size,
        frame.x, frame.y,
        frame.w, frame.h
    );
    pop();

    // Click to open the pause menu with added cooldown
    if (hovering && mouseIsPressed && !inGameSettingsClickLock && millis() > menuCooldownTimer) {
        menuCooldownTimer = millis() + 500;
        inGameSettingsClickLock = true;
        if (typeof playSFX === "function") {
            playSFX("click");
        }
        paused = true;
    }
    if (!mouseIsPressed) {
        inGameSettingsClickLock = false;
    }
}

/** True when the mouse is over the in-game settings button hitbox. */
function isMouseOverInGameSettingsButton() {
    const x = IN_GAME_SETTINGS_BTN_X;
    const y = IN_GAME_SETTINGS_BTN_Y;
    const size = IN_GAME_SETTINGS_BTN_SIZE;
    return mouseX >= x && mouseX <= x + size &&
           mouseY >= y && mouseY <= y + size;
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
    if (levelName === 'edm') { // edm level
        edmSetup();
    }
    if (levelName === 'lofi') { // lofi level
        lofiSetup();
    }
    if (levelName === 'end') { // end screen 
        endScreenSetup();
    }
    playLevelMusic();
}

function keyPressed() {
    pressedKeys[key] = true;
    if (typeof showSettings !== "undefined" && showSettings && key === "Escape") {
        showSettings = false;
        return;
    }
    if (key == 'Escape' && levelRender != 'menu') {
        // Toggle pausing variable
        if (showTutorialOverlay) {
            return
        };
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
    if (!player.is_entering) {
        tryFireMouseProjectile();
    }
}

function handleHeldFire() {
    if (mouseIsPressed) {
        tryFireMouseProjectile();
    }
}

function tryFireMouseProjectile() {
    if (levelRender === "menu") {
        return;
    }
    if (typeof player_1 === "undefined" || !player_1 || typeof projectiles === "undefined") {
        return;
    }
    // Don't fire when the player is clicking the in-game settings (gear) button.
    if (isMouseOverInGameSettingsButton()) {
        return;
    }

    if (player_1.is_entering) {
        return;
    }

    const now = millis();
    if (now - lastPlayerFireAt < PLAYER_FIRE_INTERVAL_MS) return;
    if (weapon == 2 && laserCooldown > 0) return;

    lastPlayerFireAt = now;
    if (weapon == 2) laserCooldown = LASER_DURATION;

    // Signal to the level that a shot was fired
    firePending = true;
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
        case 'edm':
            levelMusic = edmMusic;
            break;
        case 'lofi':
            levelMusic = lofiMusic;
            break;
        case 'end':
            levelMusic = endMusic; // change this to end level music when added
            break;
        case 'tutorial':
            levelMusic = tutorialMusic;
            break;
        default:
            levelMusic = menuMusic;
            break;
    }
    levelMusic.setVolume(music_volume); // change the volume between 0.0 and 1.0 if needed
    levelMusic.loop();
    userStartAudio();
}

/**
 * Applies global music_volume to every loaded music track so menu / tutorial / game over stay in sync.
 */
function applyMusicVolume() {
    if (typeof menuMusic !== "undefined" && menuMusic) {
        menuMusic.setVolume(music_volume);
    }
    if (typeof levelMusic !== "undefined" && levelMusic) {
        levelMusic.setVolume(music_volume);
    }
    if (typeof tutorialMusic !== "undefined" && tutorialMusic) {
        tutorialMusic.setVolume(music_volume);
    }
    if (typeof gameOverMusic !== "undefined" && gameOverMusic) {
        gameOverMusic.setVolume(music_volume);
    }
}

/**
 * LLM-Generated FPS Counter
 * Tracks the number of frames drawn every second
 * https://p5js.org/reference/p5/frameRate/
 */
function fpsCounter() {
    let currentFps = frameRate(); // Get the current framerate from p5.js
    
    push(); // Save current drawing style settings
    
    // Styling for the FPS text
    fill(0, 255, 0); // Bright green text
    noStroke();
    textSize(20);
    textAlign(LEFT, TOP);
    textFont('Courier New'); // Monospace font keeps the text from jittering width-wise
    
    // Draw the text in the top-left corner
    // .toFixed(1) rounds the number to 1 decimal place (e.g., 60.0)
    text(currentFps.toFixed(1), 10, 10); 
    
    pop(); // Restore previous drawing style settings so we don't mess up other renders
}

/**
 * Displays the health bar in the bottom left of the screen
 */
let healthIndex;
function displayHealthBar(player) {
    if (typeof player === "undefined" || !player || typeof healthBarData === "undefined") {
        return;
    }
    
    healthIndex = Math.max(0, Math.min(5, 5 - player.health));

    let frame = healthBarData.frames[healthIndex].position;
    
    push();
    image(
        healthBarSheet,     
        20, height - 60,
        230, 40,
        frame.x, frame.y,
        frame.w, frame.h
    );
    pop();
}

/**
 * Displays the game over screen
 */
function displayGameOver() {
    // Stop all other music and play game over music
    if (!gameOverMusicPlaying) {
        gameOverMusicPlaying = true;
        if (levelMusic !== undefined) {
            levelMusic.stop();
        }
        if (tutorialMusic !== undefined) {
            tutorialMusic.stop();
        }
        if (menuMusic !== undefined) {
            menuMusic.stop();
        }
        if (gameOverMusic !== undefined) {
            gameOverMusic.loop();
            gameOverMusic.setVolume(music_volume);
        }
    }
    
    if (typeof gameOverImage === "undefined" || !gameOverImage) {
        fill(0);
        rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        drawArcadeWavesSurvivedOverlay();
        drawGameOverMainMenuButton();
        return;
    }
    image(gameOverImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawArcadeWavesSurvivedOverlay();
    drawGameOverMainMenuButton();
}

/**
 * Arcade rock level: show how many waves were cleared before death.
 */
function drawArcadeWavesSurvivedOverlay() {
    if (game_mode !== "arcade" || levelRender !== "rock") {
        return;
    }
    if (typeof arcade_waves_survived === "undefined") {
        return;
    }
    push();
    if (typeof pixelFont !== "undefined" && pixelFont) {
        textFont(pixelFont);
    }
    textAlign(CENTER, CENTER);
    textSize(64);
    const x = CANVAS_WIDTH / 2;
    const y = CANVAS_HEIGHT / 2 + 55;
    fill(0, 0, 0, 200);
    text(`Waves survived: ${arcade_waves_survived}`, x + 3, y + 3);
    fill(255, 230, 120);
    text(`Waves survived: ${arcade_waves_survived}`, x, y);
    pop();
}

/**
 * Displays the tutorial images with navigation arrows
 */
function displayTutorial() {
    // Draw semi-transparent background
    fill(0, 0, 0, 200);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Display current tutorial image with margins
    const margin = 40;
    const imgWidth = CANVAS_WIDTH - (margin * 2);
    const imgHeight = CANVAS_HEIGHT - (margin * 2) - 100; // Leave space for buttons
    const imgX = margin;
    const imgY = margin;
    
    if (tutorialImages[tutorialIndex]) {
        if(tutorialIndex == 3){
            let canvasElt = document.querySelector('#game-container canvas');
            let rect = canvasElt.getBoundingClientRect();
            let scale = rect.width / CANVAS_WIDTH;

            tutorialGifCreate.show();
            tutorialGifCreate.size(imgWidth * scale/2.5, imgHeight * scale/2.5);
            tutorialGifCreate.position(rect.x + ((imgX + 50) * scale), rect.y + ((imgY + 175) * scale));
        } else{
            tutorialGifCreate.hide();
        }
        image(tutorialImages[tutorialIndex], imgX, imgY, imgWidth, imgHeight);
    }
    
    // Button dimensions and positions
    const buttonSize = 50;
    const buttonY = CANVAS_HEIGHT - 60;
    const leftArrowX = CANVAS_WIDTH / 2 - 80;
    const rightArrowX = CANVAS_WIDTH / 2 + 80;
    
    // Draw left arrow (always visible)
    if (tutorialIndex > 0) {
        drawLeftArrow(leftArrowX, buttonY, buttonSize);
        if (isHoveringButton(leftArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            menuCooldownTimer = millis() + 500;
            tutorialClickFlag = true;
            tutorialIndex--;
        }
    }
    
    // Draw right arrow or X
    if (tutorialIndex < tutorialImages.length - 1) {
        drawRightArrow(rightArrowX, buttonY, buttonSize);
        if (isHoveringButton(rightArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            menuCooldownTimer = millis() + 500;
            tutorialClickFlag = true;
            tutorialIndex++;
            
        }
    } else {
        drawExitX(rightArrowX, buttonY, buttonSize);
        if (isHoveringButton(rightArrowX, buttonY, buttonSize) && mouseIsPressed && !tutorialClickFlag) {
            menuCooldownTimer = millis() + 500;
            tutorialClickFlag = true;
            tutorialGifCreate.hide();
            if (showTutorialOverlay) {
                showTutorialOverlay = false; // ← just hide the overlay, pause menu stays
            } else {
                levelRender = "menu";
                playLevelMusic();
            }
        }
    }
    
    // Reset click flag when mouse is released
    if (!mouseIsPressed) {
        tutorialClickFlag = false;
    }
}

/**
 * Helper function to check if mouse is hovering over a button
 */
function isHoveringButton(x, y, size) {
    return mouseX >= x - size/2 && mouseX <= x + size/2 &&
           mouseY >= y - size/2 && mouseY <= y + size/2;
}

/**
 * Draws a left arrow button
 */
function drawLeftArrow(x, y, size) {
    push();
    fill(100, 150, 255);
    stroke(255);
    strokeWeight(2);
    
    if (isHoveringButton(x, y, size)) {
        fill(150, 200, 255);
    }
    
    // Draws the arrow
    triangle(
        x + size/3, y - size/3,      // top point
        x - size/3, y,               // left point
        x + size/3, y + size/3       // bottom point
    );
    triangle(
        x + size/3, y - size/3,
        x + size/3, y + size/3,
        x + size/4, y
    );
    
    pop();
}

/**
 * Draws a right arrow button
 */
function drawRightArrow(x, y, size) {
    push();
    fill(100, 150, 255);
    stroke(255);
    strokeWeight(2);
    
    if (isHoveringButton(x, y, size)) {
        fill(150, 200, 255);
    }
    
    // Draws the arrow
    triangle(
        x - size/3, y - size/3,      // top point
        x + size/3, y,               // right point
        x - size/3, y + size/3       // bottom point
    );
    triangle(
        x - size/3, y - size/3,
        x - size/3, y + size/3,
        x - size/4, y
    );
    
    pop();
}

/**
 * Draws an X button to exit tutorial
 */
function drawExitX(x, y, size) {
    push();
    fill(255, 100, 100);
    stroke(255);
    strokeWeight(3);
    
    if (isHoveringButton(x, y, size)) {
        fill(255, 150, 150);
    }
    
    // Draw X
    line(x - size/3, y - size/3, x + size/3, y + size/3);
    line(x + size/3, y - size/3, x - size/3, y + size/3);
    
    pop();
}

/**
 * main menu button on death screen
 */
function drawGameOverMainMenuButton() {
  const w = 240;
  const h = 60;
  const x = CANVAS_WIDTH / 2;
  const y = CANVAS_HEIGHT - 35;

  imageMode(CENTER);
  image(returnMenuButton[0], x, y, w, h);

  if (isHovering("gameover_menu", x, y, w, h)) {
    image(returnMenuButton[1], x, y, w, h);

    if (mouseIsPressed && !gameOverMouseLock && millis() > menuCooldownTimer) {
      menuCooldownTimer = millis() + 500;
      gameOverMouseLock = true;
      playSFX("click");

      gameOver = false;
      gameOverMusicPlaying = false;
      if (gameOverMusic) gameOverMusic.stop();
      levelRender = 'menu';
      playLevelMusic();
    }
  }

  if (!mouseIsPressed) {
    gameOverMouseLock = false;
  }

  imageMode(CORNER);
}

/**
 * main menu button on end screen
 */
function drawEndScreenMainMenuButton() {
  const w = 240;
  const h = 60;
  const x = CANVAS_WIDTH / 2;
  const y = CANVAS_HEIGHT - 35;

  imageMode(CENTER);
  image(returnMenuButton[0], x, y, w, h);

  if (isHovering("gameover_menu", x, y, w, h)) {
    image(returnMenuButton[1], x, y, w, h);

    if (mouseIsPressed && !endScreenMouseLock && millis() > menuCooldownTimer) {
      menuCooldownTimer = millis() + 500;
      endScreenMouseLock = true;
      playSFX("click");

      levelRender = 'menu';
      playLevelMusic();
    }
  }

  if (!mouseIsPressed) {
    endScreenMouseLock = false;
  }

  imageMode(CORNER);
}

function drawEndScreenCreditsButton() {
  var w = 240;
  var h = 60;
  var x = CANVAS_WIDTH / 2;
  var y = CANVAS_HEIGHT - 105;

  imageMode(CENTER);
  image(creditsButton[0], x, y, w, h);

  if (isHovering("end_credits_btn", x, y, w, h)) {
    image(creditsButton[1], x, y, w, h);

    if (mouseIsPressed && !endScreenMouseLock && millis() > menuCooldownTimer) {
      menuCooldownTimer = millis() + 500;
      endScreenMouseLock = true;
      playSFX("click");
      showCredits = true;
    }
  }

  if (!mouseIsPressed) {
    endScreenMouseLock = false;
  }

  imageMode(CORNER);
}

function drawCreditsScreen() {

  if (typeof creditsImage !== "undefined" && creditsImage) {
    imageMode(CENTER);
    image(creditsImage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);
    imageMode(CORNER);
  }

  // X close button
  var size = 50;
  var x = CANVAS_WIDTH - size - 15;
  var y = 15;
  var hovering = mouseX >= x && mouseX <= x + size && mouseY >= y && mouseY <= y + size;

  push();
  fill(hovering ? color(255, 80, 80) : color(180, 50, 50));
  stroke(255);
  strokeWeight(2);
  rect(x, y, size, size, 6);

  stroke(255);
  strokeWeight(3);
  var pad = 13;
  line(x + pad, y + pad, x + size - pad, y + size - pad);
  line(x + size - pad, y + pad, x + pad, y + size - pad);
  pop();

  if (hovering && mouseIsPressed && !creditsMouseLock && millis() > menuCooldownTimer) {
    menuCooldownTimer = millis() + 500;
    creditsMouseLock = true;
    playSFX("click");
    showCredits = false;
  }

  if (!mouseIsPressed) {
    creditsMouseLock = false;
  }
}

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-15, License - CC BY-SA 4.0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}