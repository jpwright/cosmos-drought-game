var stage;
var player;
var tiles = [];

var PLAYER_SPEED = 0.1;
var TILE_DIMENSION = 32; // Width and height of each tile.
var WALL_TILES = [1, 2, 3, 9, 10, 11, 17, 18, 19, 31, 32, 39, 40, 46, 47, 48];

function init() {
    // create a new stage and point it at our canvas:
    stage = new createjs.Stage("testCanvas");
    
    // load the spritesheet image:
    var image = new Image();
    image.onload = handleLoad;
    image.src = "../assets/tmw_desert_spacing.png";
}

function handleLoad(evt) {
    // define the spritesheet:
    var ss = new createjs.SpriteSheet({
            images: [evt.target],
            frames: {width:TILE_DIMENSION, height:TILE_DIMENSION, regX:0, regY:0, spacing:1, margin:1}
        });

    // define a tile map:
    var map = [
        [ 1,  2,  2,  2,  2,  2,  2,  2,  2,  3, 30, 30],
        [ 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 30, 30],
        [ 9, 10, 10, 20, 18, 18, 21, 10, 10, 11, 39, 30],
        [17, 18, 18, 19, 30, 30, 17, 18, 18, 19, 30, 39],
        [30, 30, 31, 30,  6,  8, 46, 30, 39, 30, 30, 30],
        [30, 30, 39, 32, 14, 16, 30, 30, 30, 30, 39, 30],
        [30, 30, 30, 30, 14, 16, 47, 30, 31, 30, 30, 30],
        [39, 30, 47, 31, 14, 16, 30, 39, 30, 30, 39, 30],
        [30, 30, 30, 30, 14, 16, 30, 47, 32, 30, 30, 30],
        [30, 30, 39, 30, 14, 16, 30, 30, 39, 30, 47, 30],
        [39, 30, 30, 39, 14, 12,  7,  7,  7,  7,  7,  7],
        [30, 32, 30, 30, 22, 23, 23, 23, 23, 23, 23, 23],
        [30, 30, 30, 39, 30, 30, 30, 32, 30, 30, 30, 30]
    ]
    
    // draw the map:
    for (var row=0; row<map.length; row++) {
        for (var col=0; col<map[0].length; col++) {
            var idx = map[row][col] - 1;

            var tile = new createjs.Sprite(ss);
            tile.gotoAndStop(idx);
            //tile.play();
            tile.x = TILE_DIMENSION*col;
            tile.y = TILE_DIMENSION*row;
            stage.addChild(tile);
            tiles.push(tile);
        }
    }
    
    player = new createjs.Shape();
    player.graphics.beginFill("red").drawCircle(0, 0, 10);
    player.x = 135;
    player.y = 135;
    stage.addChild(player);
    
    // update the stage to draw to screen:
    stage.update();
    
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setFPS(24);
}

function collision(new_position_x, new_position_y) {

    var tile = stage.getObjectsUnderPoint(new_position_x, new_position_y, 0)[1]
    var tile_id = tile.currentFrame + 1;
    
    if (WALL_TILES.indexOf(tile_id) != -1) {
    
        // If tile_id is not in WALL_TILES, indexOf() returns -1 so we don't enter this block.
        
        if(tile_id == 47) {
            // Small Bush
            tile.gotoAndStop(47);
        } else if (tile_id == 39) {
            // Large Bush
            tile.gotoAndStop(39);
        }
        return true;
    } else {
        return false;
    }
}

function movePlayer(dir, delta) {
    //console.log(stage.getObjectsUnderPoint(player.x, player.y, 0)[1].currentFrame);
    switch(dir) {
        case 'up':
            var np_x = player.x;
            var np_y = player.y - (delta * PLAYER_SPEED);
            if (!collision(np_x, np_y)) {
              player.y = np_y;
            }
            break;
        case 'down':
            var np_x = player.x;
            var np_y = player.y + (delta * PLAYER_SPEED);
            if (!collision(np_x, np_y)) {
              player.y = np_y;
            }
            break;
        case 'left':
            var np_x = player.x - (delta * PLAYER_SPEED);
            var np_y = player.y;
            if (!collision(np_x, np_y)) {
              player.x = np_x;
            }
            break;
        case 'right':
            var np_x = player.x + (delta * PLAYER_SPEED);
            var np_y = player.y;
            if (!collision(np_x, np_y)) {
              player.x = np_x;
            }
            break;
        default:
            //Don't need to do anything
    }

}

function tick (event) {
    if (key.isPressed('up') || key.isPressed('w')) {
        movePlayer('up', event.delta);
        // event.delta is the time (in milliseconds) elapsed since the previous frame.
    }
    if (key.isPressed('down') || key.isPressed('s')) {
        movePlayer('down', event.delta);
    }
    if (key.isPressed('left') || key.isPressed('a')) {
        movePlayer('left', event.delta);
    }
    if (key.isPressed('right') || key.isPressed('d')) {
        movePlayer('right', event.delta);
    }
    stage.update(event);
}