/**************************************************
** GAME VARIABLES
**************************************************/
var
  localPlayer,  // Local player
  remotePlayers,
  newPlayers,
  socket,
  cursors,
  graphics,
  game,
  name;

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
  var nameForm = document.getElementById('nameForm');
  nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    name = nameForm.name.value;

    if (name) {
      nameForm.style.display = 'none';
      initGame();
    }
  });
  nameForm.style.display = 'block';
}

function initGame() {
  console.log("init");

  // Initialise the local player
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

  var startX = Math.round(Math.random()*(512)),
    startY = Math.round(Math.random()*(512));

  localPlayer = new Player(game, startX, startY, name);
  remotePlayers = [];
  newPlayers = [];

  socket = io("http://localhost:8000");

  // Start listening for events
  setEventHandlers();
};

function preload() {
  game.load.image("background", 'assets/images/houseBackground.png');
  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  game.load.spritesheet('sword', 'assets/images/sword_anim.png', 101, 108);
}

function create() {
  console.log('create');
  game.add.tileSprite(0, 0, 800, 600, 'background');
  cursors = {
    'up': game.input.keyboard.addKey(Phaser.Keyboard.W),
    'left': game.input.keyboard.addKey(Phaser.Keyboard.A),
    'down': game.input.keyboard.addKey(Phaser.Keyboard.S),
    'right': game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  graphics = game.add.graphics(0, 0);
  game.input.mouse.capture = true;

  localPlayer.create();

}

/*function clickDown(evt) {
  if (game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON) {
      console.log("lmb");
      localPlayer.LMBclickDown(evt);
  }
}*/

function update() {
  graphics.clear();

  //for rendering new players
  for (var i = 0; i < newPlayers.length; i++) {
    newPlayer = newPlayers[i];
    newPlayer.create();
  }
  newPlayers = [];


  if (localPlayer.update(cursors, graphics)) {
    socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY(), rot: localPlayer.getRot()});
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
};

function onSocketConnected() {
  console.log("Connected to socket server");
  socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), rot: localPlayer.getRot(), name: localPlayer.name});
};

function onSocketDisconnect() {
  console.log("Disconnected from socket server");
  socket.emit("disconnect", {id: localPlayer.getId()});
};

function onNewPlayer(data) {
  console.log("New player connected: "+data.id);
  var newPlayer = new Player(game, data.x, data.y, data.name);
  newPlayer.id = data.id;
  newPlayers.push(newPlayer);
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
  movePlayer.setRot(data.rot);
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
