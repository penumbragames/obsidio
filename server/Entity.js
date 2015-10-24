/**
 * Wrapper class for all entities on the server.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {number} x The x coordinate of the entity.
 * @param {number} y The y coordinate of the entity.
 * @param {number} vx The velocity in the x direction of the entity.
 * @param {number} vy The velocity in the y direction of the entity.
 * @param {number} orientation The orientation of the entity in radians.
 * @param {number} hitboxSize The size of the hitbox of the entity. All
 *   entities will have a circular hitbox where the hitboxSize defines the
 *   radius of the hitbox.
 * @param {[number, number]} drawSize The width and height of this entity
 *   in pixels when it is drawn on the client side.
 */
function Entity(x, y, vx, vy, orientation, hitboxSize, drawSize) {
  this.x = x || 0;
  this.y = y || 0;
  this.vx = vx || 0;
  this.vy = vy || 0;
  this.orientation = orientation || 0;
  this.hitboxSize = hitboxSize || 0;
  this.drawSize = drawSize || [];

  this.lastUpdateTime = 0;
  this.updateTimeDifference = 0;
}

/**
 * Returns true if this entity has collided with the given entity.
 * @param {Entity} other The entity to check collision against.
 */
Entity.prototype.isCollidedWith = function(other) {
  var minDistance = this.hitboxSize + other.hitboxSize;
  return Util.getEuclideanDistance2(this.x, this.y, other.x, other.y) <
    (minDistance * minDistance);
};

/**
 * Returns true if this entity is visible to the given player.
 * @param {Player} player The player to check visibility to.
 */
Entity.prototype.isVisibleTo = function(player) {
  return Util.inBound(
      this.x,
      player.x - Constants.VISIBILITY_THRESHOLD_X,
      player.x + Constants.VISIBILITY_THRESHOLD_X) && Util.inBound(
      this.y,
      player.y - Constants.VISIBILITY_THRESHOLD_Y,
      player.y + Constants.VISIBILITY_THRESHOLD_Y);
};

/**
 * Updates the entity's position based on its velocity according to
 * the amount of time the passed between this update and the last
 * update.
 */
Entity.prototype.update = function() {
  var currentTime = (new Date()).getTime();
  if (this.lastUpdateTime == 0) {
    this.updateTimeDifference = 0;
  } else {
    this.updateTimeDifference = currentTime - this.lastUpdateTime;
  }
  this.x += this.vx * this.updateTimeDifference;
  this.y += this.vy * this.updateTimeDifference;
  this.lastUpdateTime = currentTime;
};

module.exports = Entity;
