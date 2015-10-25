/**
 * This class stores global constants between the client and server.
 * @author Alvin Lin (alin18@stuy.edu)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

/**
 * The world will always be a square, so there's no need for an x and y max.
 * WORLD and CANVAS constants should mirror those in the client side
 * JavaScript.
 * All values are in pixels.
 */
Constants.WORLD_MIN = 0;
Constants.WORLD_MAX = 2500;
Constants.WORLD_PADDING = 30;
Constants.CANVAS_WIDTH = 800;
Constants.CANVAS_HEIGHT = 600;
/**
 * Constants.VISIBILITY_THRESHOLD_X = (Constants.CANVAS_WIDTH / 2) + 25
 */
Constants.VISIBILITY_THRESHOLD_X = 425;
/**
 * Constants.VISIBILITY_THRESHOLD_Y = (Constants.CANVAS_HEIGHT / 2) + 25
 */
Constants.VISIBILITY_THRESHOLD_Y = 325;

/**
 * Construct types indicate the global index of that construct in other arrays.
 */
Constants.CONSTRUCT_TYPES = {
  NONE: -1,
  TURRET: 0
};

/**
 * Indicates the praesidium cost of the construct, indexed by the above array.
 * TURRET: 75
 */
Constants.CONSTRUCT_REQUIREMENT = [ 75 ];

try {
  module.exports = Constants;
} catch (err) {}
