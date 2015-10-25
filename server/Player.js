/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
 * @param {number} x The x coordinate to generate the player at.
 * @param {number} y The y coordinate to generate the player at.
 * @param {number} orientation This represents the direction the player will
 *   face and is a radian measure.
 * @param {number} hitboxSize The hitbox size of this player. This number
 *   represents the radius of the circular hitbox in pixels.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @param {number} vmag The magnitude of the player's velocity in
 *   pixels/millisecond.
 * @param {number} shotCooldown The time between the player's shots in
 *   milliseconds.
 * @param {number} health The amount of health that the player starts with.
 */
function Player(x, y, orientation, hitboxSize, name, id,
                vmag, shotCooldown, health) {
  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.hitboxSize = hitboxSize;

  this.name = name;
  this.id = id;
  this.vmag = vmag;
  this.shotCooldown = shotCooldown;
  this.lastShotTime = 0;

  this.health = health;
  this.praesidia = 0;
  this.kills = 0;
  this.deaths = 0;
}
require('./inheritable');
Player.inheritsFrom(Entity);

/**
 * TURN_RATE is in radians per millisecond.
 * DEFAULT_VELOCITY_MAGNITUDE is in pixels per millisecond.
 * DEFAULT_SHOT_COOLDOWN is in milliseconds.
 * DEFAULT_HITBOX_SIZE is in pixels.
 * MAX_HEALTH is in health units.
 * MINIMUM_RESPAWN_BUFFER is a distance in pixels.
 */
Player.DEFAULT_VELOCITY_MAGNITUDE = 0.3;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.DEFAULT_HITBOX_SIZE = 24;
Player.MAX_HEALTH = 10;
Player.MINIMUM_RESPAWN_BUFFER = 1000;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  var point = Util.getRandomWorldPoint();
  var orientation = Util.randRange(0, 2 * Math.PI);
  var hitboxSize = Player.DEFAULT_HITBOX_SIZE;
  var vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
  var shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  var health = Player.MAX_HEALTH;
  return new Player(point[0], point[1], orientation, hitboxSize, name, id,
                    vmag, shotCooldown, health);
};

/**
 * Updates this player given the the client's keyboard state and mouse angle
 * for setting the tank turret.
 * @param {Object} keyboardState A JSON Object storing the state of the
 *   client keyboard.
 * @param {number} orientation The angle of the client's mouse with respect
 *   to their player sprite.
 */
Player.prototype.updateOnInput = function(keyboardState, orientation) {
  if (keyboardState.up) {
    this.vy = (keyboardState.left || keyboardState.right) ?
        -this.vmag / Math.SQRT2 : -this.vmag;
  }
  if (keyboardState.down) {
    this.vy = (keyboardState.left || keyboardState.right) ?
        this.vmag / Math.SQRT2 : this.vmag;
  }

  if (keyboardState.left) {
    this.vx = (keyboardState.up || keyboardState.down) ?
        -this.vmag / Math.SQRT2 : -this.vmag;
  }
  if (keyboardState.right) {
    this.vx = (keyboardState.up || keyboardState.down) ?
        this.vmag / Math.SQRT2 : this.vmag;
  }

  if ((!keyboardState.up && !keyboardState.down) ||
      (keyboardState.up && keyboardState.down)) {
    this.vy = 0;
  }
  if ((!keyboardState.left && !keyboardState.right) ||
      (keyboardState.left && keyboardState.right)) {
    this.vx = 0;
  }

  this.orientation = orientation;
};

/**
 * Updates the player's position and powerup states, this runs in the 60Hz
 * server side loop so that powerups expire even when the player is not
 * moving or shooting.
 */
Player.prototype.update = function() {
  this.parent.update.call(this);

  var boundedCoord = Util.boundWorld(this.x, this.y);
  this.x = boundedCoord[0];
  this.y = boundedCoord[1];
};

/**
 * Returns a boolean indicating if the player's shot cooldown has passed and
 * the player can shoot.
 * @return {boolean}
 */
Player.prototype.canShoot = function() {
  return (new Date()).getTime() >
    this.lastShotTime + this.shotCooldown;
};

/**
 * Returns a bullet that the player has shot assuming that the player CAN
 * shoot. Resets lastShotTime.
 * @return {Bullet}
 */
Player.prototype.getProjectileShot = function() {
  this.lastShotTime = (new Date()).getTime();
  return Bullet.create(this.x, this.y, this.orientation, this.id);
};

/**
 * Returns a boolean determining if the player is dead or not.
 * @return {boolean}
 */
Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * Damages the player by the given amount, factoring in shields.
 * @param {number} amount The amount to damage the player by.
 */
Player.prototype.damage = function(amount) {
  this.health -= amount;
};

/**
 * Handles the respawning of the player when killed.
 * @param {Array.<Player>} players An array of players to check against for
 *   smart respawning.
 * @todo The player respawn calculation with the minimum buffer doesn't quite
 *   work.
 */
Player.prototype.respawn = function(players) {
  var point = Util.getRandomWorldPoint();
  var isValidSpawn = false;
  var iter = 0;
  while (!isValidSpawn || iter < 15) {
    isValidSpawn = true;
    for (var i = 0; i < players; ++i) {
      if (Util.getEuclideanDistance2(point[0], point[1],
                                     players[i].x, players[i].y) <
          Player.MINIMUM_RESPAWN_BUFFER * Player.MINIMUM_RESPAWN_BUFFER) {
        isValidSpawn = false;
        continue;
      }
    }
    point = Util.getRandomWorldPoint();
    iter++;
  }

  this.x = point[0];
  this.y = point[1];
  this.health = Player.MAX_HEALTH;
  this.deaths++;
};

module.exports = Player;
