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

Drawing.UI_COLOR = '#AAAAAA';
Drawing.UI_ITEM_COLOR = '#DDDDDD';

Drawing.BASE_IMG_URL = '/static/img/';
Drawing.SELF_PLAYER_SRC = Drawing.BASE_IMG_URL + 'self_player.png';
Drawing.OTHER_PLAYER_SRC = Drawing.BASE_IMG_URL + 'other_player.png';
Drawing.PROJECTILE_SRC = Drawing.BASE_IMG_URL + 'projectile.png';
Drawing.PRAESIDIUM_SRC = Drawing.BASE_IMG_URL + 'praesidium.png';
Drawing.TURRET_SRC = Drawing.BASE_IMG_URL + 'turret.png';
Drawing.TILE_SRC = Drawing.BASE_IMG_URL + 'tile.png';

Drawing.PLAYER_SIZE = [64, 64];
Drawing.PROJECTILE_SIZE = [8, 8];
Drawing.PRAESIDIUM_SIZE = [32, 32];
Drawing.TURRET_SIZE = [64, 64];
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
  var projectile = new Image();
  projectile.src = Drawing.PROJECTILE_SRC;
  this.context.drawImage(projectile,
                         -Drawing.PROJECTILE_SIZE[0] / 2,
                         -Drawing.PROJECTILE_SIZE[1] / 2,
                         Drawing.PROJECTILE_SIZE[0],
                         Drawing.PROJECTILE_SIZE[1]);
  this.context.restore();
};

Drawing.prototype.drawPraesidium = function(coords, quantity) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  var praesidium = new Image();
  praesidium.src = Drawing.PRAESIDIUM_SRC;
  this.context.drawImage(praesidium,
                         -Drawing.PRAESIDIUM_SIZE[0] / 2,
                         -Drawing.PRAESIDIUM_SIZE[1] / 2,
                         Drawing.PRAESIDIUM_SIZE[0],
                         Drawing.PRAESIDIUM_SIZE[1]);
  this.context.restore();
};

Drawing.prototype.drawTurret = function(coords) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  var turret = new Image();
  turret.src = Drawing.TURRET_SRC;
  this.context.drawImage(turret,
                         -Drawing.TURRET_SIZE[0] / 2,
                         -Drawing.TURRET_SIZE[1] / 2,
                         Drawing.TURRET_SIZE[0],
                         Drawing.TURRET_SIZE[1]);
  this.context.restore();
}

Drawing.prototype.drawUI = function(health, praesidia) {
  this.context.fillStyle = Drawing.UI_COLOR;
  this.context.fillRect(0, 0, 200, 60);
  this.context.font = Drawing.FONT;
  this.context.fillStyle = Drawing.FONT_COLOR;
  this.context.fillText("Health: ", 10, 20);
  this.context.fillText("Praesidia: " + praesidia, 10, 40);
  for (var i = 0; i < 10; ++i) {
    if (i < health) {
      this.context.fillStyle = Drawing.HP_COLOR;
    } else {
      this.context.fillStyle = Drawing.HP_MISSING_COLOR;
    }
    this.context.fillRect(70 + 10 * i, 10, 10, 10)
  }
  this.context.fillStyle = Drawing.UI_COLOR;
  this.context.fillRect(700, 0, 100, 600);
  this.context.fillStyle = Drawing.UI_ITEM_COLOR;
  this.context.fillRect(710, 10, 80, 80);
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

function roundedRect(context, x, y, width, height, radius, fill, stroke) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height);
  
}
