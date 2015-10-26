/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author Alvin Lin (omgimanerd1998@gmail.com)
 */

/**
 * Creates a game on the client side to manage and render the players,
 * projectiles, and powerups.
 * @constructor
 * @param {Socket} socket The socket connected to the server.
 * @param {Leaderboard} leaderboard The Leaderboard object to update.
 * @param {Drawing} drawing The Drawing object that will render the game.
 * @param {ViewPort} viewPort The ViewPort object that will manage the player's
 *   current view.
 * @param {Environment} environment The Environment object that handles the
 *   drawing of the game environment.
 */
function Game(socket, leaderboard, drawing, viewPort,
              environment) {
  this.socket = socket;

  this.leaderboard = leaderboard;
  this.drawing = drawing;
  this.viewPort = viewPort;
  this.environment = environment;

  this.self = null;
  this.players = [];
  this.projectiles = [];
  this.praesidia = [];
  this.constructs = [];
  this.latency = 0;

  this.currentActionState = Game.ACTION_STATES.NONE;
  this.currentBuildType = Constants.CONSTRUCT_TYPES.NONE;
}

Game.ACTION_STATES = {
  NONE: -1,
  CONTROL: 0,
  BUILD_PENDING: 1
};

/**
 * Factory method to create a Game object.
 * @param {Socket} socket The socket connected to the server.
 * @param {Element} canvasEl The canvas element that the game will use to
 *   draw to.
 * @param {Element} leaderboardEl The div element that the game will draw
 *   the leaderboard to.
 */
Game.create = function(socket, canvasEl, leaderboardEl) {
  canvasEl.width = Constants.CANVAS_WIDTH;
  canvasEl.height = Constants.CANVAS_HEIGHT;
  var canvasContext = canvasEl.getContext('2d');

  var leaderboard = new Leaderboard(leaderboardEl);
  var drawing = new Drawing(canvasContext);
  var viewPort = new ViewPort();
  var environment = new Environment(viewPort, drawing);
  return new Game(socket, leaderboard, drawing,
                  viewPort, environment);
};

/**
 * Initializes the game and sets the game to respond to update packets from
 * the server.
 */
Game.prototype.init = function() {
  var context = this;
  this.socket.on('update', function(data) {
    context.receiveGameState(data);
  });
  this.drawing.init(
    function(type) { // startBuild(type)
      if (context.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
        cancelBuild(context);
      } else {
        startBuild(context, type);
      }
    },
    function() { // cancelBuild()
      cancelBuild(context);
    }
  );
};

function startBuild(context, type) {
  var buildOptions = document.getElementsByClassName('ui-build-option');
  context.currentActionState = Game.ACTION_STATES.BUILD_PENDING;
  context.currentBuildType = type;
  for (var i = 0; i < buildOptions.length; ++i) {
    buildOptions[i].style.backgroundImage = 'url(' + Drawing.CANCEL_SRC +
        '), url(' + Drawing.NEUTRAL_CONSTRUCT_SRC[i] + ')';
  }
};

function cancelBuild(context) {
  var buildOptions = document.getElementsByClassName('ui-build-option');
  context.currentActionState = Game.ACTION_STATES.CONTROL;
  context.currentBuildType = Constants.CONSTRUCT_TYPES.NONE;
  for (var i = 0; i < buildOptions.length; ++i) {
    buildOptions[i].style.backgroundImage =
      'url(' + Drawing.NEUTRAL_CONSTRUCT_SRC[i] + ')';
  }
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object}
 */
Game.prototype.receiveGameState = function(state) {
  this.leaderboard.update(state.leaderboard);

  this.self = state.self;
  this.players = state.players;
  this.projectiles = state.projectiles;
  this.praesidia = state.praesidia;
  this.constructs = state.constructs;
  this.latency = state.latency;
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    this.viewPort.update(this.self.x, this.self.y);

    var build = this.self.build;
    var orientation = Math.atan2(
      Input.MOUSE[1] - Constants.CANVAS_HEIGHT / 2,
      Input.MOUSE[0] - Constants.CANVAS_WIDTH / 2) + Math.PI / 2;
    var shot = false;

    // TODO: Fix shooting after placing construct
    if (Input.LEFT_CLICK || Input.TOUCH) {
      if (Input.MOUSE[0] >= 0 && Input.MOUSE[0] < 700 &&
          Input.MOUSE[1] >= 0 && Input.MOUSE[1] < 600) {
        if (this.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
          var coords = this.viewPort.toAbsoluteCoords(Input.MOUSE);
          build = {
            type: this.currentBuildType,
            x: coords[0],
            y: coords[1]
          }
          cancelBuild(this);
        } else {
          shot = true;
        }
      }
    }

    // Emits an event for the containing the player's intention to move
    // or shoot to the server.
    var packet = {
      keyboardState: {
        up: Input.UP,
        right: Input.RIGHT,
        down: Input.DOWN,
        left: Input.LEFT
      },
      orientation: orientation,
      shot: shot,
      build: build,
      timestamp: (new Date()).getTime()
    };
    this.socket.emit('player-action', packet);
  }
};

/**
 * Draws the state of the game onto the HTML5 canvas.
 */
Game.prototype.draw = function() {
  // Clear the canvas.
  this.drawing.clear()

  // Draw the background first.
  this.environment.draw();

  // Draw praesidia pallets.
  for (var i = 0; i < this.praesidia.length; ++i) {
    this.drawing.drawPraesidium(
      this.viewPort.toCanvasCoords([this.praesidia[i].x, this.praesidia[i].y]),
      this.praesidia[i].quantity);
  }

  // Draw the projectiles.
  for (var i = 0; i < this.projectiles.length; ++i) {
    this.drawing.drawProjectile(
      this.viewPort.toCanvasCoords(
          [this.projectiles[i].x, this.projectiles[i].y]),
      this.projectiles[i].orientation);
  }

  // Draw any other players.
  for (var i = 0; i < this.players.length; ++i) {
    this.drawing.drawPlayer(
      false,
      this.viewPort.toCanvasCoords([this.players[i].x, this.players[i].y]),
      this.players[i].orientation,
      this.players[i].name,
      this.players[i].health);
  }

  // Draw the UI and self player last.
  if (this.self) {
    // Draw constructs.
    for (var i = 0; i < this.constructs.length; ++i) {
      var constructCoords = this.viewPort.toCanvasCoords(
          [this.constructs[i].x, this.constructs[i].y]);
      var owner = (this.self.id == this.constructs[i].owner) ?
          'self' : 'other';
      this.drawing.drawConstruct(owner,
                                 constructCoords,
                                 this.constructs[i].orientation,
                                 this.constructs[i].health,
                                 this.constructs[i].type);
    }

    // Draw build UI.
    if (this.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
      var requirement = Constants.CONSTRUCT_REQUIREMENT[this.currentBuildType];
      var mouseCoords = this.viewPort.toAbsoluteCoords(Input.MOUSE);
      var color = (this.self.praesidia >= requirement &&
                   Util.getEuclideanDistance2(mouseCoords[0], mouseCoords[1],
                                              this.self.x, this.self.y) <=
                   Constants.CONSTRUCT_BUILD_RADIUS *
                   Constants.CONSTRUCT_BUILD_RADIUS) ?
        '#00FF00' : '#FF0000';
      this.drawing.drawRange(this.viewPort.toCanvasCoords([this.self.x,
                                                           this.self.y]),
                             Constants.CONSTRUCT_BUILD_RADIUS,
                             color);
      this.drawing.context.globalAlpha = 0.7;
      this.drawing.drawConstruct('build_pending', Input.MOUSE, 0, 0,
                                 this.currentBuildType);
      this.drawing.context.globalAlpha = 1;
    }
    this.drawing.drawUI(this.self.health, this.self.praesidia);

    // Draw the player.
    this.drawing.drawPlayer(
      true,
      this.viewPort.toCanvasCoords([this.self.x, this.self.y]),
      this.self.orientation,
      this.self.name,
      this.self.health);
  }
};
