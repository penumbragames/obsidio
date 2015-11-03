/**
 * Stores the state of a projectile on the server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Constructor for a projectile.
 * @constructor
 * @param {number} x The x coordinate of this projectile.
 * @param {number} y The y coordinate of this projectile.
 * @param {number} vx The velocity in the x direction of this projectile.
 * @param {number} vy The velocity in the y direction of this projectile.
 * @param {number} orientation The orientation of this projectile in radians.
 * @param {number} hitboxSize The size of this projectile's hitbox. This number
 *   is a circular radius in pixels.
 * @param {string} source The socket ID of the player that fired this
 *   projectile.
 * @param {number} damage The amount of damage this projectile will do upon
 *   impact.
 * @extends Entity
 */
function Projectile(x, y, vx, vy, orientation, hitboxSize, source, damage) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.orientation = orientation;

  this.hitboxSize = hitboxSize;
  this.source = source;
  this.damage = damage;

  this.distanceTraveled = 0;
  this.shouldExist = true;
}
require('./inheritable');
Projectile.inheritsFrom(Entity);

/**
 * VELOCITY_MAGNITUDE is in pixels per millisecond.
 * DEFAULT_DAMAGE is in health points.
 * MAX_TRAVEL_DISTANCE is in pixels.
 * HITBOX_SIZE is in pixels and represents a radius around the projectile entity.
 */
Projectile.VELOCITY_MAGNITUDE = 0.85;
Projectile.DEFAULT_DAMAGE = 1;
Projectile.MAX_TRAVEL_DISTANCE = 1000;
Projectile.DEFAULT_HITBOX_SIZE = 4;

/**
 * Factory method for the Projectile object. This is meant to be called from the
 * context of a Player.
 * @param {number} x The starting x-coordinate of the projectile (absolute).
 * @param {number} y The starting y-coordinate of the projectile (absolute).
 * @param {number} direction The direction the projectile will travel in
 *   radians.
 * @param {string} source The socket ID of the player that fired the
 *   projectile.
 */
Projectile.create = function(x, y, direction, source) {
  var vx = Projectile.VELOCITY_MAGNITUDE * Math.cos(direction - Math.PI / 2);
  var vy = Projectile.VELOCITY_MAGNITUDE * Math.sin(direction - Math.PI / 2);
  var hitboxSize = Projectile.DEFAULT_HITBOX_SIZE;
  var damage = Projectile.DEFAULT_DAMAGE;
  return new Projectile(x, y, vx, vy, direction, hitboxSize, source, damage);
};

/**
 * Updates this projectile and checks for collision with any player.
 * We reverse the coordinate system and apply sin(direction) to x because
 * canvas in HTML will use up as its '0' reference point while JS math uses
 * left as its '0' reference point.
 * this.direction always is stored in radians.
 * @param {Hashmap} clients The Hashmap of active IDs and players stored on
 *   the server.
 * @param {Array.<Construct>} An array of the currently existing constructs.
 */
Projectile.prototype.update = function(clients, constructs) {
  this.parent.update.call(this);

  this.distanceTraveled += Projectile.VELOCITY_MAGNITUDE *
      this.updateTimeDifference;
  if (this.distanceTraveled > Projectile.MAX_TRAVEL_DISTANCE ||
      !Util.inWorld(this.x, this.y)) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.source != players[i].id &&
        players[i].isCollidedWith(this)) {
      players[i].damage(this.damage);
      if (players[i].isDead()) {
        var killingPlayer = clients.get(this.source);
        killingPlayer.kills++;
      }
      this.shouldExist = false;
      return;
    }
  }

  for (var i = 0; i < constructs.length; ++i) {
    if ((this.source != constructs[i].owner ||
         constructs[i].type == Constants.CONSTRUCT_TYPES.WALL) &&
        constructs[i].isCollidedWith(this)) {
      constructs[i].damage(this.damage);
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Projectile;
