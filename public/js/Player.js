/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(room, startX, startY, playerName) {
  var x = startX,
    y = startY,

    hsp = 0,
    vsp = 0,
    mvang = 0,
    groudFric = 1,
    weight = 1,
    moveAmount = 6,

    swordRot = 0,
    id,
    game = room,
    sprite,
    sword,
    swingTimer = 0.5, //seconds
    canMove = true,
    action = true,
    lives = 2,
    name = playerName;

    var swordOffsetX = 16,
    swordOffsetY = 32,
    swordRotOffset = -70;

  var swordOffsetX = 20,
  swordOffsetY = 40,
  swordRotOffset = -60;

  var hitboxes = [];

  var create = function() {
    sprite = game.add.sprite(x, y, 'dude');
    sprite.anchor.setTo(0.5);
    sword = game.add.sprite(x, y, 'sword');
    sword.animations.add('swing', [0, 1, 2, 3, 4, 5], 50, false);
    sword.anchor.x = 28/101;
    sword.anchor.y = 28/108;

    var style = { font: '16px Arial', fill: '#ffffff', align: 'center' };
    var text = game.make.text(0, -30, name, style);
    text.anchor.set(0.5);
    sprite.addChild(text);
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
    mx = game.input.mousePointer.x;
    my = game.input.mousePointer.y;
    deltaRot =  swordRot;
    swordRot = game.physics.arcade.angleToPointer(sprite) + swordRotOffset;

    if (game.input.activePointer.leftButton.isDown) {
      LMBclickDown(this);
    }

    var vecX = 0; //key vector
    var vecY = 0;
    if (canMove) {

      if (cursors.up.isDown) {
        vecY -= 1;
      }
      if (cursors.down.isDown) {
        vecY += 1;
      };
      if (cursors.left.isDown) {
        vecX -= 1;
      }
      if (cursors.right.isDown) {
        vecX += 1;
      };
    }

    /*******************************/
    // smooth physics math dw bout it ;)
    var keyang = Math.atan2(vecY, vecX);

    if (vecX != 0 || vecY != 0) {
      hsp += Math.cos(keyang) * 2 * groudFric;
      vsp += Math.sin(keyang) * 2 * groudFric;
      mvang = Math.atan2(vsp, hsp);
    }

    var d = Math.sqrt(vsp*vsp + hsp*hsp);
    if (d > moveAmount) {
      d = moveAmount;
    }
    hsp = Math.cos(mvang) * d;
    vsp = Math.sin(mvang) * d;

    var d2 = Math.sqrt(vsp*vsp + hsp*hsp);

    if (d2 > groudFric) {
      d2 -= groudFric;
    } else {
      d2 = 0;
    }

    hsp = Math.cos(mvang) * d2;
    vsp = Math.sin(mvang) * d2;
    mvang = Math.atan2(vsp, hsp);
    /*******************************/


    setX(x+hsp);
    setY(y+vsp);
    setRot(swordRot);

    for (var i = 0; i < hitboxes.length; i++) {
      hitboxes[i].update(gfx);
    }

    return true;//keypress || (deltaRot != sword.rotation);
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
    removeHBox: removeHBox,
    name: name
  }
};