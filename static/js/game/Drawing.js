/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 * @todo Add explosion drawing.
 */

/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor
 */
function Drawing(context) {
  this.context = context;
};

Drawing.FONT = '14px Helvetica';
Drawing.FONT_COLOR = 'black';

Drawing.HP_COLOR = 'green';
Drawing.HP_MISSING_COLOR = 'red';

Drawing.BASE_IMG_URL = '/static/img/';
Drawing.SELF_PLAYER_SRC = Drawing.BASE_IMG_URL + 'self_player.png';
Drawing.OTHER_PLAYER_SRC = Drawing.BASE_IMG_URL + 'other_player.png';
Drawing.PROJECTILE_SRC = Drawing.BASE_IMG_URL + 'bullet.png';
Drawing.PLAYER_SIZE = [64, 64];
Drawing.PROJECTILE_SIZE = [24, 24];
Drawing.TILE_SRC = Drawing.BASE_IMG_URL + 'tile.png';
Drawing.TILE_SIZE = 100;

Drawing.prototype.drawPlayer = function(isSelf, coords, orientation, name) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var player = new Image();
  if (isSelf) {
    player.src = Drawing.SELF_PLAYER_SRC;
  } else {
    player.src = Drawing.OTHER_PLAYER_SRC;
  }
  this.context.drawImage(player,
                         -Drawing.PLAYER_SIZE[0] / 2,
                         -Drawing.PLAYER_SIZE[1] / 2,
                         Drawing.PLAYER_SIZE[0],
                         Drawing.PLAYER_SIZE[1]);
  this.context.restore();
};

Drawing.prototype.drawProjectile = function(coords, orientation) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var bullet = new Image();
  bullet.src = Drawing.PROJECTILE_SRC;
  this.context.drawImage(bullet,
                         -Drawing.PROJECTILE_SIZE[0] / 2,
                         -Drawing.PROJECTILE_SIZE[1] / 2,
                         Drawing.PROJECTILE_SIZE[0],
                         Drawing.PROJECTILE_SIZE[1]);
  this.context.restore();
};

Drawing.prototype.drawPraesidium = function() {
  
};

Drawing.prototype.drawUI = function(health, praesidium) {
  this.context.font = Drawing.FONT;
  this.context.fillStyle = Drawing.FONT_COLOR;
  this.context.fillText("Health: ", 10, 20);
  this.context.fillText("Praesidium: " + praesidium, 10, 40);
  for (var i = 0; i < 10; ++i) {
    if (i < health) {
      this.context.fillStyle = Drawing.HP_COLOR;
    } else {
      this.context.fillStyle = Drawing.HP_MISSING_COLOR;
    }
    this.context.fillRect(70 + 10 * i, 10, 10, 10)
  }
};

/**
 * Draws the background tiles.
 * @param {[number, number]} topLeft The coordinates of the top-leftmost
 *   point to start laying down the tiles from.
 * @param {[number, number]} bottomRight The coordinates of the
 *   bottom-rightmost point to stop laying the tiles down at.
 */

Drawing.prototype.drawTiles = function(topLeft, bottomRight) {
  this.context.save();
  var tile = new Image();
  tile.src = Drawing.TILE_SRC;
  for (var x = topLeft[0]; x < bottomRight[0]; x += Drawing.TILE_SIZE) {
    for (var y = topLeft[1]; y < bottomRight[1]; y += Drawing.TILE_SIZE) {
      this.context.drawImage(tile, x, y);
    }
  }
  this.context.restore();
}
