/**************************************************
** GAME PLAYER CLASS
**************************************************/
var HitBoxSwing = function(c, room, startX, startY, rot) {
  var x = startX,
    y = startY,
    rot = rot,
    game = room,
    life = 5,
    player = c;

  var create = function() {

  };

  var destroy = function() {

  }

  var getRot = function() {
    return rot;
  };

  var getX = function() {
    return x;
  };

  var getY = function() {
    return y;
  };

  var setRot = function(newRot) {
    rot = newRot;
  }

  var setX = function(newX) {
    x = newX;
  };

  var setY = function(newY) {
    y = newY;
  };

  var update = function(gfx) {

    setX(x);
    setY(y);
    setRot(rot);

    gfx.lineStyle(4, 0xFF0000);
    gfx.arc(x, y, 70,
      rot+(Math.PI/2),
      rot, true);
    gfx.lineStyle(0);

    life--;
    if (life == 0) {
      player.removeHBox(this);
    }

    return true;
  };

  return {
    getX: getX,
    getY: getY,
    getRot: getRot,
    setX: setX,
    setY: setY,
    setRot, setRot,
    update: update,
    create: create,
    destroy: destroy
  }
};