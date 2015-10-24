/**
 * This is a class that encapsulates the praesidium pallets that can be picked
 * up to increase your own supply.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Entity = require('./Entity');

/**
 * Constructor for a Praesidium object.
 * @constructor
 * @param {number} x The x coordinate of this praesidium pallet.
 * @param {number} y The y coordinate of this praesidium pallet.
 * @param {number} quantity The amount of praesidium that this pallet will
 *   give upon pickup.
 */
function Praesidium(x, y, quantity) {
  this.x = x;
  this.y = y;
  this.quantity = quantity;

  this.hitboxSize = Praesidium.HITBOX_SIZE;

  this.shouldExist = true;
}
require('./inheritable');
Praesidium.inheritsFrom(Entity);

Praesidium.HITBOX_SIZE = 10;

/**
 * This method updates this praesidium pallet and adds its value to a player's
 * praesidium count if the player has collided with it.
 * @param {Hashmap} clients The hashmap of connected players.
 */
Praesidium.prototype.update = function(clients) {
  var players = clients.values();
  for (var i = 0; i < this.players.length; ++i) {
    if (players[i].isCollidedWith(this)) {
      players[i].praesidium += this.quantity;
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Praesidium;
