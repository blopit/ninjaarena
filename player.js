var Player = function(startX, startY, playerName) {
  var x = startX,
    y = startY,
    rot = 0,
    id,
    name = playerName;

  var getX = function() {
    return x;
  };

  var getY = function() {
    return y;
  };

  var getRot = function() {
    return rot;
  };

  var setX = function(newX) {
    x = newX;
  };

  var setY = function(newY) {
    y = newY;
  };

  var setRot = function(newRot) {
    rot = newRot;
  };

  return {
    getX: getX,
    getY: getY,
    getRot: getRot,
    setX: setX,
    setY: setY,
    setRot, setRot,
    id: id,
    name: name
  };
};

exports.Player = Player;