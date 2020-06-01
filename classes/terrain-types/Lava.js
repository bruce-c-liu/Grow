export class Lava {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.width = ctx.canvas.width;
    this.height = 10;
    this.x = 0;
    this.y = ctx.canvas.height - this.height;
    this.color = 'red';
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
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
