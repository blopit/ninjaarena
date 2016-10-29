/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(room, startX, startY) {
  var x = startX,
    y = startY,
    id,
    moveAmount = 3,
    game = room,
    sprite;

  var create = function() {
    sprite = game.add.sprite(x, y, 'dude');
    //game.physics.arcade.enable(sprite);
  };

  var destroy = function() {
    sprite.kill();
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
    }
  };

  var setY = function(newY) {
    y = newY;
    if (sprite) {
      sprite.y = newY;
    }
  };

  var update = function(cursors) {
    var keypress = false;

    // Up key takes priority over down
    if (cursors.up.isDown) {
      sprite.y -= moveAmount;
      keypress = true;
    } else if (cursors.down.isDown) {
      sprite.y += moveAmount;
      keypress = true;
    };

    // Left key takes priority over right
    if (cursors.left.isDown) {
      sprite.x -= moveAmount;
      keypress = true;
    } else if (cursors.right.isDown) {
      sprite.x += moveAmount;
      keypress = true;
    };

    return keypress;
  };

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    update: update,
    create: create,
    destroy: destroy
  }
};