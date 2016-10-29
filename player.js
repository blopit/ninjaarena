var Player = function(startX, startY) {
  var x = startX,
    y = startY,
    rot = 0,
    id;

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
    id: id
  }
};

exports.Player = Player;