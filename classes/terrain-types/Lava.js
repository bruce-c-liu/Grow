export class Lava {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.width = canvas.width;
    this.height = 10;
    this.x = 0;
    this.y = canvas.height - this.height;

    this.COLOR = 'red';
  }

  update(secondsElapsed, checkPlayerCollision = false, player) {
    //this check is necessary because player can move off screen
    if (checkPlayerCollision) {
      let playerBottomY = player.y + player.height;
      if (player.state === 'IDLE') {
        player.state = 'FALLING';
      }
      // PLAYER FELL INTO LAVA
      if (playerBottomY >= this.y + 20) {
        player.reset();
      }
    }
  }
  draw() {
    // it's a hole. don't need to draw.
    // TODO: remove drawing. or maybe not? Could be lava.
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
