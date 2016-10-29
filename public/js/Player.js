/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(room, startX, startY) {
  var x = startX,
    y = startY,
    id,
    moveAmount = 3,
    game = room,
    sprite,
    sword,
    actionTime = 0;

  var create = function() {
    sprite = game.add.sprite(x, y, 'dude');
    sword = game.add.sprite(x, y, 'sword');
    sword.animations.add('swing', [0, 1, 2, 3, 4 ,5], 25, false);
  };

  var destroy = function() {
    sprite.kill();
    sword.kill();
  }

  var getX = function() {
    if (sprite) {
      return sprite.x;
    } else {
      return x;
    }
  };

  var getY = function() {
    if (sprite) {
      return sprite.y;
    } else {
      return y;
    }
  };

  var setX = function(newX) {
    x = newX;
    if (sprite) {
      sprite.x = newX;
      sword.x = newX;
    }
  };

  var setY = function(newY) {
    y = newY;
    if (sprite) {
      sprite.y = newY;
      sword.y = newY;
    }
  };

  var click = function(evt) {
    sword.animations.play('swing');
  };

  var update = function(cursors) {
    var keypress = false;

    // Up key takes priority over down
    if (cursors.up.isDown) {
      y -= moveAmount;
      keypress = true;
    } else if (cursors.down.isDown) {
      y += moveAmount;
      keypress = true;
    };

    // Left key takes priority over right
    if (cursors.left.isDown) {
      x -= moveAmount;
      keypress = true;
    } else if (cursors.right.isDown) {
      x += moveAmount;
      keypress = true;
    };

    setX(x);
    setY(y);

    return keypress;
  };

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    update: update,
    create: create,
    destroy: destroy,
    click: click
  }
};