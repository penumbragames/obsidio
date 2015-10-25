/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Creates a game on the client side to manage and render the players,
 * projectiles, and powerups.
 * @constructor
 * @param {Socket} socket The socket connected to the server.
 * @param {Element} canvas The HTML5 canvas to render the game on.
 * @param {Element} leaderboard The div element to render the leaderboard in.
 */
function Game(socket, canvas, leaderboard) {
  this.socket = socket;

  this.canvas = canvas;
  this.canvas.width = Constants.CANVAS_WIDTH;
  this.canvas.height = Constants.CANVAS_HEIGHT;
  this.canvasContext = this.canvas.getContext('2d');

  this.leaderboard = new Leaderboard(leaderboard);

  this.drawing = new Drawing(this.canvasContext);
  this.viewPort = new ViewPort();
  this.environment = new Environment(this.viewPort, this.drawing);

  this.self = null;
  this.players = [];
  this.projectiles = [];
  this.praesidia = [];
  this.constructs = [];
  this.latency = 0;

  this.currentActionState = Game.ACTION_STATES.NONE;
  this.currentBuildType = Game.BUILD_TYPES.NONE;
};

Game.ACTION_STATES = {
  NONE: -1,
  CONTROL: 0,
  BUILD_PENDING: 1
}

Game.BUILD_TYPES = {
  NONE: -1,
  TURRET: 0
}

/**
 * Initializes the game and sets the game to respond to update packets from the
 * server.
 */
Game.prototype.init = function() {
  var context = this;
  this.socket.on('update', function(data) {
    context.receiveGameState(data);
  });
  this.drawing.init(function(type) { // startBuild(type)
    if (context.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
      context.currentActionState = Game.ACTION_STATES.CONTROL;
      context.currentBuildType = Game.BUILD_TYPES.NONE;
    } else {
      context.currentActionState = Game.ACTION_STATES.BUILD_PENDING;
      context.currentBuildType = type;
    }
  }, function() { // cancelBuild()
    if (context.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
      context.currentActionState = Game.ACTION_STATES.CONTROL;
      context.currentBuildType = Game.BUILD_TYPES.NONE;
    }
  });
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
          this.currentActionState = Game.ACTION_STATES.CONTROL;
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
  this.canvasContext.clearRect(0, 0, Constants.CANVAS_WIDTH,
                               Constants.CANVAS_HEIGHT);

  // Draw the background first.
  this.environment.draw();

  // Draw praesidia pallets.
  for (var i = 0; i < this.praesidia.length; ++i) {
    this.drawing.drawPraesidium(
      this.viewPort.toCanvasCoords(this.praesidia[i]),
      this.praesidia[i].quantity);
  }
  
  // Draw the projectiles.
  for (var i = 0; i < this.projectiles.length; ++i) {
    this.drawing.drawProjectile(
      this.viewPort.toCanvasCoords(this.projectiles[i]),
      this.projectiles[i].orientation);
  }
  
  // Draw any other players.
  for (var i = 0; i < this.players.length; ++i) {
    this.drawing.drawPlayer(
      false,
      this.viewPort.toCanvasCoords(this.players[i]),
      this.players[i].orientation,
      this.players[i].name);
  }

  // Draw constructs.
  for (var i = 0; i < this.constructs.length; ++i) {
    this.drawing.drawConstruct(this.viewPort.toCanvasCoords(this.constructs[i]),
                               this.constructs[i].orientation,
                               this.currentBuildType);
  }
  
  // Draw the UI last.
  if (this.self) {
    // Draw build HUD.
    if (this.currentActionState == Game.ACTION_STATES.BUILD_PENDING) {
      this.drawing.drawRange(this.viewPort.toCanvasCoords(this.self), 128);
      this.drawing.context.globalAlpha = 0.7;
      this.drawing.drawConstruct(Input.MOUSE, 0, this.currentBuildType);
      this.drawing.context.globalAlpha = 1;
    }
    this.drawing.drawUI(this.self.health, this.self.praesidia);
    
    // Draw the player.
    this.drawing.drawPlayer(
      true,
      this.viewPort.toCanvasCoords(this.self),
      this.self.orientation,
      this.self.name);

  }
  
};
