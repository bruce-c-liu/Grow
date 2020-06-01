const jumpSFX = new Audio('assets/sounds/jump2.wav');

export class Player {
  constructor(ctx, canvas, terrainScrollSpeed, gameSpeed) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.height = 30;
    this.width = 30;
    this.x = canvas.width / 2;
    this.y = 0;
    this.TERRAIN_SCROLL_SPEED = terrainScrollSpeed;
    this.BODY_COLOR = 'rgb(3, 214, 144)';
    this.EYE_COLOR = 'black';
    this.STRAFE_SPEED = 100 * gameSpeed; // speed of moving left/right
    this.JUMP_SPEED = -900; // initial speed of player jumping up
    this.GRAVITY = 3000;

    // book-keeping variables
    this.xSpeed = -this.TERRAIN_SCROLL_SPEED;
    this.ySpeed = 0;
    this.Y_SPEED_MAX = 950; // max ySpeed. (limit this to prevent falling through platforms)
    this.state = 'FALLING'; // [IDLE, JUMPING, FALLING]
    this.isDucking = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  update(secondsElapsed) {
    // player exited left frame
    if (this.x + this.width < 0) {
      this.reset();
    }

    if (this.state === 'JUMPING' || this.state === 'FALLING') {
      // https://gamedev.stackexchange.com/questions/15708/how-can-i-implement-gravity/41917#41917
      // Verlot method. Apparently it's better than Euler's method.
      this.y += secondsElapsed * (this.ySpeed + (secondsElapsed * this.GRAVITY) / 2);
      if (this.ySpeed < this.Y_SPEED_MAX) {
        this.ySpeed += secondsElapsed * this.GRAVITY;
      }

      if (this.ySpeed > 0) {
        this.state = 'FALLING';
      }
    }

    this.x += this.xSpeed * secondsElapsed;
  }

  draw() {
    if (this.isDucking) {
      //body
      this.ctx.beginPath();
      this.ctx.fillStyle = this.BODY_COLOR;
      this.ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2 + 10,
        30,
        10,
        0,
        Math.PI / 4,
        (3 / 4) * Math.PI,
        true
      );
      this.ctx.fill();

      //eye
      this.ctx.fillStyle = this.EYE_COLOR;
      this.ctx.beginPath();
      this.ctx.ellipse(this.x + this.width, this.y + 23, 6, 2, 0, -0.9 * Math.PI, 0.9 * Math.PI);
      this.ctx.fill();
    } else {
      //body
      this.ctx.fillStyle = this.BODY_COLOR;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);

      //eye
      this.ctx.fillStyle = this.EYE_COLOR;
      this.ctx.beginPath();
      this.ctx.ellipse(this.x + this.width - 7, this.y + 12, 3, 6, 0, -0.9 * Math.PI, 0.9 * Math.PI);
      this.ctx.fill();

      // this.ctx.fillRect(this.x + this.width - 10, this.y + 6, 4, 10);

      if (this.state === 'JUMPING') {
        this.ctx.fillStyle = '#94ebce';
        this.ctx.fillRect(this.x + 2, this.y + this.height + 4, this.width - 3.5, 3);
      }
    }
  }

  strafe(direction) {
    if (direction === 'left') {
      this.isMovingLeft = true;
      this.xSpeed = -this.STRAFE_SPEED - this.TERRAIN_SCROLL_SPEED;
    } else if (direction === 'right') {
      this.isMovingRight = true;
      this.xSpeed = this.STRAFE_SPEED;
    }
  }

  endStrafe(direction) {
    if (direction === 'left') {
      this.isMovingLeft = false;
      this.xSpeed = this.isMovingRight ? this.STRAFE_SPEED : -this.TERRAIN_SCROLL_SPEED;
    } else if (direction === 'right') {
      this.isMovingRight = false;
      this.xSpeed = this.isMovingLeft
        ? -this.STRAFE_SPEED - this.TERRAIN_SCROLL_SPEED
        : -this.TERRAIN_SCROLL_SPEED;
    }
  }

  jump() {
    this.state = 'JUMPING';
    this.ySpeed = this.JUMP_SPEED;
    if (!jumpSFX.paused) {
      jumpSFX.load();
    }
    jumpSFX.play();
  }

  land(yPosition) {
    this.y = yPosition;
    this.state = 'IDLE';
    this.ySpeed = 0;
  }

  duck() {
    this.isDucking = true;
  }

  endDuck() {
    this.isDucking = false;
  }

  reset() {
    this.x = this.canvas.width / 2 + 100;
    this.y = 0;
    // this.xSpeed = 0;
    this.ySpeed = 0;
    this.state = 'FALLING';
  }
}
