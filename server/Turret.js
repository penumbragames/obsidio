/**
 * This is the class file that encapsulates a turret that the player can build.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Entity = require('./Entity');

/**
 * Constructor for a Turret.
 * @constructor
 * @param {number} x The x coordinate of this turret.
 * @param {number} y The y coordinate of this turret.
 * @param {number} orientation The orientation of this turret in radians.
 * @param {string} owner The socket ID of the player that placed this
 *   turret.
 */
function Turret(x, y, orientation, owner) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.orientation = orientation;
  this.hitboxSize = Turret.HITBOX_SIZE;

  this.owner = owner;

  this.shotCooldown = Turret.SHOT_COOLDOWN;
  this.health = Turret.MAX_HEALTH;
}
require('./inheritable');
Turret.inheritsFrom(Entity);

Turret.SHOT_COOLDOWN = 500;
Turret.MAX_HEALTH = 10;
Turret.HITBOX_SIZE = 10;
Turret.MINIMUM_SHOOTING_DISTANCE_SQUARED = 200;

/**
 * Given an array of players, this function returns a player
 * @param {Array.<Player>} player The player object to check against.
 */
Turret.prototype.getTarget = function(players) {
  return Util.getEuclideanDistance2(this.x, this.y, player.x, player.y) <
    Turret.MINIMUM_SHOOTING_DISTANCE_SQUARED;
};

/**
 * Updates this turret.
 */
Turret.prototype.update = function(clients) {
//  var players = clients.values();
//  var context = this;
//  players = players.filter(function(player) {
//    return context.isInShootingRange(player);
//  }).sort(;
};

Turret.prototype.damage = function(amount) {
  this.health -= amount;
};
