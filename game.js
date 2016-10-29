var util = require("util"),
  io = require("socket.io")({
    transports  : [ 'websocket' ]
  });
  Player = require("./Player").Player;

var socket,
  players;

function init() {
  players = [];
  socket = io.listen(8000);
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
};

function onClientDisconnect(data) {
    console.log(this);
    util.log("Player has disconnected: "+data.id);
    onRemovePlayer(data)
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
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

  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
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