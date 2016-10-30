/**************************************************
** GAME PLAYER CLASS
**************************************************/
var V = SAT.Vector;
var P = SAT.Polygon;
var HitBoxSwing = function(c, room, startX, startY, rot) {

  var r1 = rot + (Math.PI/2);
  var r3 = rot;
  var r2 = (r1 + r3) / 2;
  var d = 70;

  var x = startX,
    y = startY,
    bounds = new P(new V(startX, startY), [
      new V(0,0),
      new V(Math.cos(r3)*d, Math.sin(r3)*d),
      new V(Math.cos(r2)*d, Math.sin(r2)*d),
      new V(Math.cos(r1)*d, Math.sin(r1)*d)
    ]),
    rot = rot,
    game = room,
    life = 15,
    player = c;

  var create = function() {

  };

  var destroy = function() {

  }
  var getPlayer = function() {
    return player;
  }

  var getBounds = function() {
    return bounds;
  };

  var getRot = function() {
    return rot;
  };

  var getX = function() {
    return x;
  };

  var getY = function() {
    return y;
  };

  var getLife = function() {
    return life;
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
    getBounds: getBounds,
    getLife: getLife,
    getPlayer: getPlayer,
    destroy: destroy
  }
};