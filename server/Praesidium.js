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
