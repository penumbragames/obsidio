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
 * Given an array of players, this function returns a player that the turret
 * will fire at.
 * @param {Array.<Player>} players The array of players to check.
 */
Turret.prototype.getTarget = function(players) {
  var target = null;
  for (var i = 0; i < players.length; ++i) {
    if (target &&
        Util.getEuclideanDistance2(this.x, this.y,
                                   players[i].x, players[i].y) <
        Util.getEuclideanDistance2(this.x, this.y,
                                   target.x, target.y)) {
      target = players[i];
    } else if (Util.getEuclideanDistance2(this.x, this.y,
                                          players[i].x, players[i].y) <
               Turret.MINIMUM_SHOOTING_DISTANCE_SQUARED) {
      target = players[i];
    }
  }
  return target;
};

/**
 * Updates this turret.
 */
Turret.prototype.update = function(clients) {
  var players = clients.values();
  var target = this.getTarget(players);
  if (target) {
    this.orientation = Math.atan2(target.y - this.y,
                                  target.x - this.x);
  }
};

Turret.prototype.damage = function(amount) {
  this.health -= amount;
};
