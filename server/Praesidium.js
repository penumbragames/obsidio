/**
 * This is a class that encapsulates the praesidium pallets that can be picked
 * up to increase your own supply.
 * @author Alvin Lin (alin18@stuy.edu)
 */

var Entity = require('./Entity');

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
Praesidium.DRAW_SIZE = [10, 10];
