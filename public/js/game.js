/**************************************************
** GAME VARIABLES
**************************************************/
var
  localPlayer,  // Local player
  remotePlayers,
  socket,
  cursors,
  game;
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
  console.log("init");
  // Declare the canvas and rendering context
  //canvas = document.getElementById("gameCanvas");
  //ctx = canvas.getContext("2d");

  // Maximise the canvas
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;

  // Initialise keyboard controls
  //keys = new Keys();

  // Calculate a random start position for the local player
  // The minus 5 (half a player size) stops the player being
  // placed right on the egde of the screen


  // Initialise the local player
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
  var startX = Math.round(Math.random()*(512)),
    startY = Math.round(Math.random()*(512));

  localPlayer = new Player(game, startX, startY);
  remotePlayers = [];

  socket = io("http://localhost:8000");

  // Start listening for events
  setEventHandlers();
};


function preload() {
  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
}

function create() {
  console.log('create');
  //game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
  console.log(localPlayer);
  localPlayer.create();

  //  Our two animations, walking left and right.
  //player.animations.add('left', [0, 1, 2, 3], 10, true);
  //player.animations.add('right', [5, 6, 7, 8], 10, true);



}

function update() {
  if (localPlayer.update(cursors)) {
    socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
  };
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

  // Window resize
  window.addEventListener("resize", onResize, false);

  socket.on("connect", onSocketConnected);
  socket.on("disconnect", onSocketDisconnect);
  socket.on("new player", onNewPlayer);
  socket.on("move player", onMovePlayer);
  socket.on("remove player", onRemovePlayer);
};

// Browser window resize
function onResize(e) {
  console.log("reszize");
  // Maximise the canvas
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
};

function onSocketConnected() {
  console.log("Connected to socket server");
  socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

function onSocketDisconnect() {
  console.log("Disconnected from socket server");
  socket.emit("disconnect", {id: localPlayer.getId()});
};

function onNewPlayer(data) {
  console.log("New player connected: "+data.id);
  var newPlayer = new Player(game, data.x, data.y);
  newPlayer.id = data.id;
  newPlayer.create();
  remotePlayers.push(newPlayer);

};

function onMovePlayer(data) {
  var movePlayer = playerById(data.id);

  console.log("moving");
  if (!movePlayer) {
      console.log("Player not found: "+data.id);
      return;
  };

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
  var removePlayer = playerById(data.id);

  // Player not found
  if (!removePlayer) {
    console.log("Player not found: "+data.id);
    return;
  };

  // Remove player from array
  removePlayer.destroy();
  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function playerById(id) {
  var i;
  for (i = 0; i < remotePlayers.length; i++) {
    if (remotePlayers[i].id == id)
      return remotePlayers[i];
  };

  return false;
};
