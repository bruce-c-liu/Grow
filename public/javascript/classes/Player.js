const jumpSFX = new Audio('../sounds/sfx/jump.wav');
const dashSFX = new Audio('../sounds/sfx/dash.wav');
dashSFX.volume = 0.6;

import { randomIntBetween } from '../utils.js';

export class Player {
  constructor({ ctx, game, terrainScrollSpeed, gameSpeed, isSelf }) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.game = game;
    this.isSelf = isSelf;

    // rgb(3, 214, 144)
    this.bodyColor = `rgb(${randomIntBetween(0, 255)}, ${randomIntBetween(0, 255)}, ${randomIntBetween(
      0,
      255
    )})`;
    this.eyeColor = 'black';

    this.height = 30;
    this.width = 30;
    this.x = ctx.canvas.width / 2 + 200;
    this.y = 0;
    this.terrainScrollSpeed = terrainScrollSpeed;
    this.strafeSpeed = 150 * gameSpeed; // speed of moving left/right
    this.jumpSpeed = -900; // initial speed of player jumping up
    this.dashDistanceX = 200;
    this.dashDistanceY = 150;
    this.dashAssistY = 15; // move the player up a tiny bit to make dashing more forgiving
    this.Y_SPEED_MAX = 900; // max ySpeed. (limit this to prevent falling through blocks)
    this.gravity = 2000;
    this.maxJumps = 2;
    this.startingLives = 3;

    // player lifetime stats (obtained from LocalStorage)
    this.exp = 0;

    // book-keeping variables
    this.curLives = this.startingLives;
    this.xSpeed = -this.terrainScrollSpeed;
    this.ySpeed = 0;
    this.curJumps = 0; // keeps track of current number of jumps in the air. Limited by this.maxJumps
    this.distanceTravelled = 0;
    this.dashAfterimages = [];

    // states
    this.yDirectionState = 'FALLING'; // possible states: ['IDLE', 'JUMPING', 'FALLING'];
    this.xDirectionState = 'IDLE'; // possible states: ['IDLE', 'MOVING_RIGHT', 'MOVING_LEFT'];
    this.isDucking = false;
  }

  update(secondsElapsed) {
    switch (this.game.state) {
      case 'PLAYING':
        if (this.x + this.width >= 0 && this.x <= this.canvas.width) {
          // vertical position updates
          if (this.yDirectionState === 'JUMPING' || this.yDirectionState === 'FALLING') {
            // https://gamedev.stackexchange.com/questions/15708/how-can-i-implement-gravity/41917#41917
            this.y += secondsElapsed * (this.ySpeed + (secondsElapsed * this.gravity) / 2);
            if (this.ySpeed < this.Y_SPEED_MAX) {
              this.ySpeed += secondsElapsed * this.gravity;
            }

            if (this.ySpeed > 0) {
              this.yDirectionState = 'FALLING';
            }
          }

          // dash afterimage updates
          for (let afterimage of this.dashAfterimages) {
            afterimage.opacity -= 0.015;
            afterimage.x -= this.terrainScrollSpeed * secondsElapsed;

            if (afterimage.opacity <= 0.05) {
              this.dashAfterimages.shift();
            }
          }

          // horizontal position updates
          this.x += this.xSpeed * secondsElapsed;
          this.distanceTravelled += this.terrainScrollSpeed * secondsElapsed;
        } else {
          // player exited left/right frame
          this.die();
        }

        break;
      case 'PAUSED':
      case 'GAME OVER':
        break;
      case 'STATS':
        break;
    }
  }

  draw() {
    switch (this.game.state) {
      case 'PLAYING':
      case 'PAUSED':
        this._draw();
        break;
      case 'GAME OVER':
        break;
      case 'STATS':
        break;
    }
  }

  _draw() {
    // jumping "tail"
    if (this.yDirectionState === 'JUMPING') {
      this.ctx.fillStyle = '#94ebdd';
      this.ctx.fillRect(this.x + 2, this.y + this.height + 4, this.width - 3.5, 2);

      if (this.curJumps === 2) {
        this.ctx.fillRect(this.x + 6, this.y + this.height + 10, this.width - 11.5, 2);
      }
    }

    // draw dash afterimages
    if (this.dashAfterimages.length) {
      for (let afterimage of this.dashAfterimages) {
        this.ctx.fillStyle = 'white';
        this.ctx.globalAlpha = afterimage.opacity;
        this.ctx.fillRect(afterimage.x, afterimage.y, afterimage.length, afterimage.length);
      }
    }

    this.ctx.globalAlpha = this.isSelf ? 1 : 0.5;

    if (this.isDucking) {
      //body
      this.ctx.beginPath();
      this.ctx.fillStyle = this.bodyColor;
      this.ctx.ellipse(this.x + this.width / 2, this.y + this.height, 25, this.height, 0, 0, Math.PI, true);

      this.ctx.fill();

      //eye
      this.ctx.fillStyle = this.eyeColor;
      this.ctx.beginPath();
      this.ctx.ellipse(this.x + this.width - 4, this.y + this.height / 2, 2, 2, 0, Math.PI, -Math.PI);
      this.ctx.fill();
    } else {
      //body
      this.ctx.fillStyle = this.bodyColor;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);

      //eye
      this.ctx.fillStyle = this.eyeColor;
      this.ctx.beginPath();
      this.ctx.ellipse(this.x + this.width - 7, this.y + 12, 3, 6, 0, -0.9 * Math.PI, 0.9 * Math.PI);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  strafe(direction) {
    if (direction === 'left') {
      this.xDirectionState = 'MOVING_LEFT';
      this.xSpeed = -this.strafeSpeed - this.terrainScrollSpeed;
    } else if (direction === 'right') {
      this.xDirectionState = 'MOVING_RIGHT';
      this.xSpeed = this.strafeSpeed;
    }
  }

  endStrafe(direction) {
    const { keysDown } = this.game;

    if (direction === 'left' && keysDown.has('d')) {
      this.xSpeed = this.strafeSpeed;
      this.xDirectionState = 'MOVING_RIGHT';
    } else if (direction === 'right' && keysDown.has('a')) {
      this.xSpeed = -this.strafeSpeed - this.terrainScrollSpeed;
      this.xDirectionState = 'MOVING_LEFT';
    } else {
      this.xSpeed = -this.terrainScrollSpeed;
      this.xDirectionState = 'IDLE';
    }
  }

  dash() {
    const { keysDown } = this.game;

    let dashDirectionX;
    if (this.xDirectionState === 'MOVING_LEFT') {
      this.x -= this.dashDistanceX;
      dashDirectionX = -1;
    } else {
      // NOTE: by default, player dashes to the right when idle
      this.x += this.dashDistanceX;
      dashDirectionX = 1;
    }

    let dashHeight = -this.dashAssistY; // move the player up a tiny bit to make dashing more forgiving
    if (keysDown.has('w')) {
      dashHeight -= this.dashDistanceY;
    }
    this.ySpeed = 0; // reset ySpeed to give player more reaction time after dashing
    this.y += dashHeight;

    this.dashAfterimages.push(
      {
        x: this.x - this.dashDistanceX * 0.8 * dashDirectionX,
        y: this.y + 25 - (dashHeight + this.dashAssistY) * 1.1,
        length: this.height * 0.4,
        opacity: 0.2,
      },
      {
        x: this.x - this.dashDistanceX * 0.5 * dashDirectionX,
        y: this.y + 24 - (dashHeight + this.dashAssistY) * 0.8,
        length: this.height * 0.5,
        opacity: 0.3,
      },
      {
        x: this.x - this.dashDistanceX * 0.2 * dashDirectionX,
        y: this.y + 20 - (dashHeight + this.dashAssistY) * 0.5,
        length: this.height * 0.7,
        opacity: 0.4,
      }
    );

    if (!dashSFX.paused) {
      dashSFX.load();
    }
    dashSFX.play();
  }

  jump() {
    if (this.curJumps < this.maxJumps) {
      this.curJumps++;
      this.yDirectionState = 'JUMPING';
      this.ySpeed = this.jumpSpeed;
      if (!jumpSFX.paused) {
        jumpSFX.load();
      }
      jumpSFX.play();
    }
  }

  land(yPosition) {
    this.curJumps = 0;
    this.y = yPosition;
    this.isIdle = true;
    this.ySpeed = 0;
  }

  setIsDucking(isDucking) {
    if (this.isDucking !== isDucking) {
      this.isDucking = isDucking;
      if (isDucking) {
        this.y += this.height / 2;
        this.height /= 2;
      } else {
        this.y -= this.height;
        this.height *= 2;
      }
    }
  }

  respawn() {
    this.x = this.canvas.width / 2 + 200;
    this.y = 0;
    // this.xSpeed = 0;
    this.ySpeed = 0;
    this.yDirectionState = 'FALLING';
    this.curJumps = 0;
  }

  die() {
    this.curLives--;

    if (this.curLives === 0) {
      this.game.gameOver();
    } else {
      this.respawn();
    }
  }

  reset() {
    this.curLives = this.startingLives;
    this.distanceTravelled = 0;
    this.respawn();
  }
}
