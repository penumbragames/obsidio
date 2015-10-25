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
 * Construct types indicate the global index of that Construct in other arrays.
 */
Constants.CONSTRUCT_TYPES = {
  NONE: -1,
  TURRET: 0,
  WALL: 3
};

/**
 * Indicates the praesidium cost of a Construct, indexed by the
 * CONSTRUCT_TYPES
 * TURRET: 75
 * WALL: 15
 */
Constants.CONSTRUCT_REQUIREMENT = [30, 0, 0, 15, 0, 0];

/**
 * Indicates the maximum health of a Construct, indexed by CONSTRUCT_TYPES
 * TURRET: 6
 * WALL: 10
 */
Constants.CONSTRUCT_MAX_HEALTH = [6, 0, 0, 10, 0, 0];

/**
 * This is the maximum distance away from the player that a Construct can be
 * created.
 */
Constants.CONSTRUCT_BUILD_RADIUS = 128;

try {
  module.exports = Constants;
} catch (err) {}
