/**
 * This is a class that encapsulates the praesidium pallets that can be picked
 * up to increase your own supply.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * Constructor for a Praesidium object.
 * @constructor
 * @param {number} x The x coordinate of this praesidium pallet.
 * @param {number} y The y coordinate of this praesidium pallet.
 * @param {number} vmag The magnitude of the velocity that the pallet
 *   will travel at.
 * @param {number} deceleration The rate at which vmag decreases.
 * @param {number} quantity The amount of praesidium that this pallet will
 *   give upon pickup.
 * @param {number} hitboxSize The hitbox size of this praesidium pallet.
 *   This number represents the radius of the circular hitbox in pixels.
 */
function Praesidium(x, y, vmag, orientation, deceleration,
                    quantity, hitboxSize) {
  this.x = x;
  this.y = y;
  this.vmag = vmag;
  this.orientation = orientation;
  this.deceleration = deceleration;
  this.quantity = quantity;
  this.hitboxSize = hitboxSize;

  this.shouldExist = true;
}
require('./inheritable');
Praesidium.inheritsFrom(Entity);

/**
 * HITBOX_SIZE is the size of each praesidium pallet's hitbox in pixels.
 * MIN_VALUE is the minimum amount of praesidium that randomly generated
 * pallets should give.
 * MAX_VALUE is the maximum amount of praesidum that randomly generated
 * pallets should give.
 * EXPLOSION_VELOCITY is the magnitude of the velocity that the pallets
 * will have if they are created as a burst.
 * EXPLOSION_DECELERATION is the deceleration of the outward burst if the
 * pallets are generated in a burst.
 */
Praesidium.HITBOX_SIZE = 12;
Praesidium.MIN_VALUE = 5;
Praesidium.MAX_VALUE = 10;
Praesidium.EXPLOSION_VELOCITY = 0.75;
Praesidium.EXPLOSION_DECELERATION = -0.05;

/**
 * Factory method to create a Praesidium.
 * @param {number} x The x coordinate of this praesidium pallet.
 * @param {number} y The y coordinate of this praesidium pallet.
 * @param {number} quantity The amount of praesidium that this pallet will
 *   give upon pickup.
 * @return {Praesidium}
 */
Praesidium.create = function(x, y, quantity) {
  var hitboxSize = Praesidium.HITBOX_SIZE;
  return new Praesidium(x, y, 0, 0, 0, quantity, hitboxSize);
};

/**
 * Creates a burst of praesidium that scatter apart from a point.
 * This is used when a player dies and they lose half their praesidium.
 */
Praesidium.createBurst = function(x, y, totalQuantity) {
  pallets = [];
  while (totalQuantity != 0) {
    var quantity = Util.randRangeInt(Praesidium.MIN_VALUE,
                                     Praesidium.MAX_VALUE);
    if (totalQuantity < 6) {
      quantity = totalQuantity;
    }
    totalQuantity -= quantity;
    var orientation = Util.randRange(0, 2 * Math.PI);
    pallets.push(new Praesidium(x, y, Praesidium.EXPLOSION_VELOCITY,
                                orientation, Praesidium.EXPLOSION_DECELERATION,
                                quantity, Praesidium.HITBOX_SIZE));
  }
  return pallets;
};

/**
 * This function returns a randomly generated praesidium pallet.
 * @return {Praesidium}
 */
Praesidium.generateRandomPraesidium = function() {
  var point = Util.getRandomWorldPoint();
  var quantity = Util.randRangeInt(Praesidium.MIN_VALUE, Praesidium.MAX_VALUE);
  var hitboxSize = Praesidium.HITBOX_SIZE;
  return new Praesidium(point[0], point[1], 0, 0, 0, quantity,
                        hitboxSize);
};

/**
 * This method updates this praesidium pallet and adds its value to a player's
 * praesidium count if the player has collided with it.
 * @param {Hashmap} clients The hashmap of connected players.
 */
Praesidium.prototype.update = function(clients) {
  this.parent.update.call(this);
  this.vmag = Math.max(0, this.vmag + this.deceleration);
  this.vx = this.vmag * Math.cos(this.orientation);
  this.vy = this.vmag * Math.sin(this.orientation);
  var boundedCoord = Util.boundWorld(this.x, this.y);
  this.x = boundedCoord[0];
  this.y = boundedCoord[1];

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (players[i].isCollidedWith(this)) {
      players[i].praesidia += this.quantity;
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Praesidium;
