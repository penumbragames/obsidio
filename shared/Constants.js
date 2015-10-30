/**
 * This class stores global constants between the client and server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
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
  WALL: 3,
  HEALER: 4
};

/**
 * Indicates the praesidium cost of a Construct, indexed by the
 * CONSTRUCT_TYPES.
 * TURRET: 75
 * WALL: 15
 * HEALER: 50
 */
Constants.CONSTRUCT_REQUIREMENT = [30, 0, 0, 15, 50, 0];

/**
 * Indicates the cooldown of the action of a Construct in milliseconds, indexed
 * by the CONSTRUCT_TYPES.
 * TURRET: 500
 * WALL: 0
 * HEALER: 2500
 */
Constants.CONSTRUCT_ACTION_COOLDOWN = [500, 0, 0, 0, 2500, 0];

/**
 * Indicates the maximum health of a Construct, indexed by CONSTRUCT_TYPES
 * TURRET: 6
 * WALL: 10
 * HEALER: 6
 */
Constants.CONSTRUCT_MAX_HEALTH = [6, 0, 0, 10, 6, 0];

/**
 * This is the maximum distance away from the player that a Construct can be
 * created.
 */
Constants.CONSTRUCT_BUILD_RADIUS = 128;

/**
 * This is the maximum health of a Player.
 */
Constants.PLAYER_MAX_HEALTH = 10;

try {
  module.exports = Constants;
} catch (err) {}
