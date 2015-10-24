/**
 * This is the class file that encapsulates a turret that the player can build.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Entity = require('./Entity');

/**
 * Constructor for a Turret.
 * @constructor
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

Turret.prototype.update = function(players) {
};

Turret.prototype.damage = function(amount) {
  this.health -= amount;
};
