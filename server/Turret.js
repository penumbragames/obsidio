/**
 * This is the class file that encapsulates a turret that the player can build.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');

/**
 * Constructor for a Turret.
 * @constructor
 * @param {number} x The x coordinate of this turret.
 * @param {number} y The y coordinate of this turret.
 * @param {number} orientation The orientation of this turret in radians.
 * @param {number} hitboxSize The size of the turret's hitbox. This represents
 *   the radius of the turret's circular hitbox.
 * @param {string} owner The socket ID of the player that placed this
 *   turret.
 * @param {number} shotCooldown This represents the time between the turret's
 *   shots in milliseconds.
 * @param {number} health This is the amount of health the turret starts with.
 */
function Turret(x, y, orientation, hitboxSize, owner, shotCooldown,
                health) {
  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.hitboxSize = hitboxSize;

  this.owner = owner;

  this.lastShotTime = 0;
  this.shotCooldown = shotCooldown;
  this.health = health;

  this.shouldExist = true;
}
require('./inheritable');
Turret.inheritsFrom(Entity);

Turret.SHOT_COOLDOWN = 500;
Turret.MAX_HEALTH = 10;
Turret.HITBOX_SIZE = 10;
Turret.MINIMUM_SHOOTING_DISTANCE_SQUARED = 200;

/**
 * Factory method to create a turret.
 * @param {number} x The x coordinate of this turret.
 * @param {number} y The y coordinate of this turret.
 * @param {number} orientation The orientation of this turret in radians.
 * @param {string} owner The socket ID of the player that placed this
 *   turret.
 */
Turret.create = function(x, y, orientation, owner) {
  var hitboxSize = Turret.HITBOX_SIZE;
  var shotCooldown = Turret.SHOT_COOLDOWN;
  var health = Turret.MAX_HEALTH;
  return new Turret(x, y, orientation, hitboxSize, owner,
                    shotCooldown, health);
};

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
 * @param {Hashmap} clients The Hashmap of active IDs and players stored on
 *   the server.
 * @param {function()} addBulletCallback The callback function to call if
 *   this turret fires a bullet.
 */
Turret.prototype.update = function(clients, addBulletCallback) {
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
  if (this.isDead()) {
    this.shouldExist = false;
  }
};

Turret.prototype.isDead = function() {
  return this.health <= 0;
};

Turret.prototype.damage = function(amount) {
  this.health -= amount;
};
