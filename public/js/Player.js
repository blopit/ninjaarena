/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(room, startX, startY) {
  var x = startX,
    y = startY,
    swordRot = 0,
    id,
    moveAmount = 5,
    game = room,
    sprite,
    sword,
    swingTimer = 0.5, //seconds
    canMove = true,
    action = true;

    var swordOffsetX = 20,
    swordOffsetY = 40,
    swordRotOffset = -60;

    var hitboxes = [];


  var create = function() {
    sprite = game.add.sprite(x, y, 'dude');
    sword = game.add.sprite(x, y, 'sword');
    sword.animations.add('swing', [0, 1, 2, 3, 4, 5], 50, false);
    sword.anchor.x = 28/101;
    sword.anchor.y = 28/108;
  };

  var destroy = function() {
    sprite.kill();
    sword.kill();
  };

  var getRot = function() {
    if (sword) {
      return swordRot;
    } else {
      return 0;
    }
  };

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

  var setRot = function(newRot) {
    swordRot = newRot;
    if (sword) {
      sword.rotation = newRot;
    }
  };

  var setX = function(newX) {
    x = newX;
    if (sprite) {
      sprite.x = newX;
      sword.x = newX + swordOffsetX;
    }
  };

  var setY = function(newY) {
    y = newY;
    if (sprite) {
      sprite.y = newY;
      sword.y = newY + swordOffsetY;
    }
  };

  var resetActionTimer = function(evt) {
    action = true;
  };

  var resetMoveTimer = function(evt) {
    canMove = true;
    sword.frame = 0;
  };

  var swing = function() {
    sword.animations.play('swing');
  };

  var stopAction = function(seconds) {
    action = false;
    game.time.events.add(Phaser.Timer.SECOND * seconds, resetActionTimer, this);
  };

  var stopMove = function(seconds) {
    canMove = false;
    game.time.events.add(Phaser.Timer.SECOND * seconds, resetMoveTimer, this);
  };

  var LMBclickDown = function(player) {
    if (action) {
      swing();
      hitboxes.push(new HitBoxSwing(player, game, sword.x, sword.y, swordRot));
      stopAction(swingTimer);
      stopMove(0.3);
    }
  };

  var removeHBox = function(hbox) {
    hitboxes.splice(hitboxes.indexOf(hbox), 1);
  }

  var update = function(cursors, gfx) {
    var keypress = false;
    mx = game.input.mousePointer.x;
    my = game.input.mousePointer.y;
    deltaRot =  swordRot;

    swordRot = game.physics.arcade.angleToPointer(sprite) + swordRotOffset;


    if (game.input.activePointer.isDown) {
      LMBclickDown(this);
    }

    if (canMove) {
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
    }

    setX(x);
    setY(y);
    setRot(swordRot);

    for (var i = 0; i < hitboxes.length; i++) {
      hitboxes[i].update(gfx);
    }

    return keypress || (deltaRot != sword.rotation);
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
    destroy: destroy,
    LMBclickDown: LMBclickDown,
    removeHBox: removeHBox
  }
};