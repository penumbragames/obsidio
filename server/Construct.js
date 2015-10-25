/**
 * This is the class file that encapsulates any player built construct.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Constructor for a Construct.
 * @constructor
 * @param {number} x The x coordinate of this construct.
 * @param {number} y The y coordinate of this construct.
 * @param {number} orientation The orientation of this construct in radians.
 * @param {number} hitboxSize The size of the construct's hitbox. This
 *   represents the radius of the construct's circular hitbox.
 * @param {string} owner The socket ID of the player that placed this
 *   construct.
 * @param {string} type The type that this construct is.
 * @param {number} health This is the amount of health the construct starts
 *   with.
 */
function Construct(x, y, orientation, hitboxSize, owner, type, health) {
  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.hitboxSize = hitboxSize;

  this.owner = owner;
  this.type = type;

  this.lastShotTime = 0;
  this.health = health;

  this.shouldExist = true;
}
require('./inheritable');
Construct.inheritsFrom(Entity);

/**
 * SHOT_COOLDOWN is the time in milliseconds between each construct shot.
 * MAX_HEALTH is the maximum health of the Construct.
 * HITBOX_SIZE is the radial size of the Construct's circular hitbox.
 * MINIMUM_SHOOTING_DISTANCE_SQUARED is the squared distance at which the
 * the Construct will start shooting at a player if it is a turret.
 */
Construct.MAX_HEALTH = 10;
Construct.HITBOX_SIZE = 10;
Construct.TURRET_SHOT_COOLDOWN = 500;
Construct.TURRET_MINIMUM_SHOOTING_DISTANCE_SQUARED = 200;

/**
 * Factory method to create a Construct.
 * @param {number} x The x coordinate of this construct.
 * @param {number} y The y coordinate of this construct.
 * @param {number} orientation The orientation of this construct in radians.
 * @param {string} owner The socket ID of the player that placed this
 *   construct.
 * @param {string} type The type of construct to create.
 */
Construct.create = function(x, y, orientation, owner, type) {
  var hitboxSize = Construct.HITBOX_SIZE;
  var health = Construct.MAX_HEALTH;
  return new Construct(x, y, orientation, hitboxSize, owner, type, health);
};

/**
 * Given an array of players, this function returns a player that the construct
 * will fire at if this construct is a turret. This does not perform a type
 * check on the construct object and will assume it is of type turret.
 * @param {Array.<Player>} players The array of players to check.
 */
Construct.prototype.getTarget = function(players) {
  var target = null;
  for (var i = 0; i < players.length; ++i) {
    if (players[i].id == this.owner) {
      continue;
    }
    if (target &&
        Util.getEuclideanDistance2(this.x, this.y,
                                   players[i].x, players[i].y) <
        Util.getEuclideanDistance2(this.x, this.y,
                                   target.x, target.y)) {
      target = players[i];
    } else if (Util.getEuclideanDistance2(this.x, this.y,
                                          players[i].x, players[i].y) <
               Construct.MINIMUM_SHOOTING_DISTANCE_SQUARED) {
      target = players[i];
    }
  }
  return target;
};

/**
 * Updates this Construct.
 * @param {Hashmap} clients The Hashmap of active IDs and players stored on
 *   the server.
 * @param {function()} addBulletCallback The callback function to call if
 *   this construct fires a bullet.
 */
Construct.prototype.update = function(clients, addBulletCallback) {
  switch (this.type) {
    // Behavior if this construct is a turret.
    case Constants.CONSTRUCT_TYPES.TURRET:
      var players = clients.values();
      var target = this.getTarget(players);
      if (target) {
        this.orientation = Math.atan2(target.y - this.y,
                                      target.x - this.x);
        if ((new Date()).getTime() > this.lastShotTime + this.shotCooldown) {
          this.lastShotTime = (new Date()).getTime();
          addBulletCallback(Bullet.create(
              this.x, this.y, this.orientation, this.owner));
        }
      }
      break;
  }

  if (this.isDead()) {
    this.shouldExist = false;
  }
};

/**
 * Returns true if this construct's health is equal to or below zero.
 * @return {boolean}
 */
Construct.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * Reduces this construct's health by the given amount.
 * @param {number} amount The amount to damage the construct by.
 */
Construct.prototype.damage = function(amount) {
  this.health -= amount;
};

module.exports = Construct;
