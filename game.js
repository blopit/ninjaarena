var util = require("util"),
  io = require("socket.io")({
    transports  : [ 'websocket' ]
  });
  Player = require("./Player").Player;

var socket,
  players;

function init() {
  players = [];
  socket = io.listen(8880);
  setEventHandlers();

};

var setEventHandlers = function() {
  socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: "+client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
  client.on("remove player", onRemovePlayer);
  client.on("hitbox create", onHitboxCreate);
};

function onHitboxCreate(data) {
  console.log("hitme: " + data.x);
  this.broadcast.emit("hitbox create", {
    id:this.id,
    x:data.x, y:data.y, rot:data.rot });
}

function onClientDisconnect() {
  util.log("Player has disconnected: " + this.id);

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    util.log("Player not found: " + this.id);
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y, data.name);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), rot: newPlayer.getRot(), name: newPlayer.name});
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), rot: existingPlayer.getRot(), name: existingPlayer.name});
  };
  players.push(newPlayer);
};

function onMovePlayer(data) {
  var movePlayer = playerById(this.id);

  if (!movePlayer) {
    util.log("Player not found: "+this.id);
    return;
  };

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
  movePlayer.setRot(data.rot);

  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), rot: movePlayer.getRot()});
};

function onRemovePlayer(data) {
  var removePlayer = playerById(data.id);

  if (!removePlayer) {
    console.log("Player not found: "+data.id);
    return;
  };

  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};

init();
