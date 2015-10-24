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
 * @param {number} x X-coordinate to generate the player at.
 * @param {number} y Y-coordinate to generate the player at.
 * @param {number} orientation Direction to face the player from 0 to 2 * PI.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
function Player(x, y, orientation, name, id) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.orientation = orientation;
  this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;

  this.name = name;
  this.id = id;
  this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  this.lastShotTime = 0;

  this.health = Player.MAX_HEALTH;
  this.praesidium = 0;
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
Player.DEFAULT_HITBOX_SIZE = 20;
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
  return new Player(point[0], point[1], orientation, name, id);
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
    this.vy = -this.vmag;
  }
  if (keyboardState.down) {
    this.vy = this.vmag;
  }
  if (!keyboardState.up && !keyboardState.down) {
    this.vy = 0;
  }

  if (keyboardState.left) {
    this.vx = -this.vmag;
  }
  if (keyboardState.right) {
    this.vx = this.vmag;
  }
  if (!keyboardState.left && !keyboardState.right) {
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
 * Applies a powerup to this player.
 * @param {string} name The name of the powerup to apply.
 * @param {Object} powerup An object containing the powerup's associated data
 *   and expiration time.
 */
Player.prototype.applyPowerup = function(name, powerup) {
  this.powerups[name] = powerup;
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
 * Returns an array containing projectiles that the player has fired,
 * factoring in all powerups. Assumes the shot cooldown has passed and the
 * player CAN shoot. Resets lastShotTime.
 * @return {Array.<Bullet>}
 */
Player.prototype.getProjectilesShot = function() {
  var bullets = [Bullet.create(this.x, this.y, this.orientation, this.id)];
  this.lastShotTime = (new Date()).getTime();
  return bullets;
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
