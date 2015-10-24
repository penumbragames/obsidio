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

Drawing.NAME_FONT = '14px Helvetica';
Drawing.NAME_COLOR = 'black';

Drawing.HP_COLOR = 'green';
Drawing.HP_MISSING_COLOR = 'red';

Drawing.BASE_IMG_URL = '/static/img/';
Drawing.PLAYER_SRC = Drawing.BASE_IMG_URL + 'player.png';
Drawing.PROJECTILE_SRC = Drawing.BASE_IMG_URL + 'bullet.png';
Drawing.TILE_SRC = Drawing.BASE_IMG_URL + 'tile.png';
Drawing.TILE_SIZE = 100;

Drawing.prototype.drawPlayer = function(isSelf, coords, size, orientation, name) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var player = new Image(size[0], size[1]);
  player.src = Drawing.PLAYER_SRC;
  this.context.drawImage(player, -size[0] / 2, -size[1] / 2);
  this.context.restore();
};

Drawing.prototype.drawProjectile = function(coords, size, orientation) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var bullet = new Image(size[0], size[1]);
  bullet.src = Drawing.PROJECTILE_SRC;
  this.context.drawImage(bullet, -size[0] / 2, -size[1] / 2);
  this.context.restore();
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
