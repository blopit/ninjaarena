/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(room, startX, startY) {
  var x = startX,
    y = startY,
    id,
    moveAmount = 300,
    game = room,
    sprite;

  var create = function() {
    sprite = game.add.sprite(x, y, 'dude');
    game.physics.arcade.enable(sprite);
  };

  var destroy = function() {
    sprite.kill();
  }

  var getX = function() {
    if (sprite) {
      return sprite.position.x;
    } else {
      return x;
    }
  };

  var getY = function() {
    if (sprite) {
      return sprite.position.y;
    } else {
      return y;
    }
  };

  var setX = function(newX) {
    x = newX;
    if (sprite) {
      sprite.position.x = x;
    }
  };

  var setY = function(newY) {
    y = newY;
    if (sprite) {
      sprite.position.y = y;
    }
  };

  var update = function(cursors) {

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    // Up key takes priority over down
    if (cursors.up.isDown) {
      sprite.body.velocity.y = -moveAmount;
    } else if (cursors.down.isDown) {
      sprite.body.velocity.y = moveAmount;
    };

    // Left key takes priority over right
    if (cursors.left.isDown) {
      sprite.body.velocity.x = -moveAmount;
    } else if (cursors.right.isDown) {
      sprite.body.velocity.x = moveAmount;
    };
    //return true;
    return (sprite.body.velocity.x != 0 || sprite.body.velocity.y != 0) ? true : false;
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