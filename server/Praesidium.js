/**
 * This is a class that encapsulates the praesidium pallets that can be picked
 * up to increase your own supply.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * Constructor for a Praesidium object.
 * @constructor
 * @param {number} x The x coordinate of this praesidium pallet.
 * @param {number} y The y coordinate of this praesidium pallet.
 * @param {number} quantity The amount of praesidium that this pallet will
 *   give upon pickup.
 * @param {number} hitboxSize The hitbox size of this praesidium pallet.
 *   This number represents the radius of the circular hitbox in pixels.
 */
function Praesidium(x, y, quantity, hitboxSize) {
  this.x = x;
  this.y = y;
  this.quantity = quantity;

  this.hitboxSize = hitboxSize;

  this.shouldExist = true;
}
require('./inheritable');
Praesidium.inheritsFrom(Entity);

Praesidium.HITBOX_SIZE = 10;
Praesidium.MIN_VALUE = 5;
Praesidium.MAX_VALUE = 10;

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
  return new Praesidium(x, y, quantity, hitboxSize);
}

/**
 * This function returns a randomly generated praesidium pallet.
 */
Praesidium.generateRandomPraesidium = function() {
  var point = Util.getRandomWorldPoint();
  var quantity = Util.randRangeInt(Praesidium.MIN_VALUE, Praesidium.MAX_VALUE);
  var hitboxSize = Praesidium.HITBOX_SIZE;
  return new Praesidium(point[0], point[1], quantity, hitboxSize);
}

/**
 * This method updates this praesidium pallet and adds its value to a player's
 * praesidium count if the player has collided with it.
 * @param {Hashmap} clients The hashmap of connected players.
 */
Praesidium.prototype.update = function(clients) {
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
