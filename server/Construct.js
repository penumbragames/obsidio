/**
 * This is the class file that encapsulates any player built construct.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');
var Praesidium = require('./Praesidium');

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
 * @param {number} actionCooldown The time between the construct's actions in
 *   milliseconds.
 * @param {number} health This is the amount of health the construct starts
 *   with.
 */
function Construct(x, y, orientation, hitboxSize, owner, type, actionCooldown,
                   health) {
  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.hitboxSize = hitboxSize;

  this.owner = owner;
  this.type = type;

  this.lastActionTime = 0;
  this.actionCooldown = actionCooldown;
  this.health = health;

  this.shouldExist = true;
}
require('./inheritable');
Construct.inheritsFrom(Entity);

/**
 * TURRET_MINIMUM_SHOOTING_DISTANCE_SQUARED is the squared distance at which
 * the Construct will start shooting at a player if it is a turret.
 * HEALER_MINIMUM_HEALING_DISTANCE_SQUARED is the squared distance at which
 * the Construct will start healing a player.
 * HITBOX_SIZE is the radial size of the Construct hitbox in pixels.
 */
Construct.TURRET_MINIMUM_SHOOTING_DISTANCE_SQUARED = 100000;
Construct.HEALER_MINIMUM_HEALING_DISTANCE_SQUARED = 16384;
Construct.HEALER_HEAL_AMOUNT = 1;
Construct.HITBOX_SIZE = 24;

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
  var actionCooldown = Constants.CONSTRUCT_ACTION_COOLDOWN[type];
  var health = Constants.CONSTRUCT_MAX_HEALTH[type];
  return new Construct(x, y, orientation, hitboxSize, owner, type,
                       actionCooldown, health);
};

/**
 * Given an array of players, this function returns a player that the construct
 * will target at if this construct has a targetable action. This does not
 * perform a type check on the construct object.
 * @param {Array.<Player>} players The array of players to check.
 * @param {Array.<Construct>} constructs The array of constructs to check.
 */
Construct.prototype.getTarget = function(players, constructs, threshold) {
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
               threshold) {
      target = players[i];
    }
  }
  if (target) {
    return target;
  }

  for (var i = 0; i < constructs.length; ++i) {
    if (constructs[i].owner == this.owner) {
      continue;
    }
    if (target &&
        Util.getEuclideanDistance2(this.x, this.y,
                                   constructs[i].x, constructs[i].y) <
        Util.getEuclideanDistance2(this.x, this.y,
                                   target.x, target.y)) {
      target = constructs[i];
    } else if (Util.getEuclideanDistance2(this.x, this.y,
                                          constructs[i].x, constructs[i].y) <
               threshold) {
      target = constructs[i];
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
 * @param {Array.<Construct>} The array of existing constructs on the server.
 */
Construct.prototype.update = function(clients, constructs, addBulletCallback,
                                      addPraesidiumCallback) {
  switch (this.type) {
    // Behavior if this construct is a turret.
    case Constants.CONSTRUCT_TYPES.TURRET:
      var players = clients.values();
      var target = this.getTarget(
          players, constructs,
          Construct.TURRET_MINIMUM_SHOOTING_DISTANCE_SQUARED);
      if (target) {
        this.orientation = -Math.atan2(target.x - this.x, target.y - this.y) +
            Math.PI;
        if ((new Date()).getTime() >
            this.lastActionTime + this.actionCooldown) {
          this.lastActionTime = (new Date()).getTime();
          addBulletCallback(Bullet.create(
              this.x, this.y, this.orientation, this.owner));
        }
      }
      break;

    // Behavior if this construct is a wall.
    case Constants.CONSTRUCT_TYPES.WALL:
      break;

    // Behavior if this construct is a healer.
    case Constants.CONSTRUCT_TYPES.HEALER:
      var owner = clients.get(this.owner);
      if (Util.getEuclideanDistance2(this.x, this.y, owner.x, owner.y) <
          Construct.HEALER_MINIMUM_HEALING_DISTANCE_SQUARED) {
        if ((new Date()).getTime() >
            this.lastActionTime + this.actionCooldown) {
          owner.heal(Construct.HEALER_HEAL_AMOUNT);
          this.lastActionTime = (new Date()).getTime();
        }
      }
      break;
  }

  if (this.isDead()) {
    this.shouldExist = false;

    var dropPraesidia = Util.randRangeInt(0, Math.floor(
        Constants.CONSTRUCT_REQUIREMENT[this.type] * 0.5));
    var praesidia = Praesidium.createBurst(this.x, this.y, dropPraesidia);
    for (var i = 0; i < praesidia.length; ++i) {
      addPraesidiumCallback(praesidia[i]);
    }
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
