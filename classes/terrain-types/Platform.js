export class Platform {
  constructor(ctx, x, y, width) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 20;
    this.color = 'white';
  }

  update(secondsElapsed, checkPlayerCollision = false, player, terrainScrollSpeed) {
    if (checkPlayerCollision) {
      let playerBottomY = player.y + player.height;

      // player above platform
      if (player.state === 'FALLING' && this.y <= playerBottomY && playerBottomY <= this.y + this.height) {
        player.land(this.y - player.height);
      }
    }

    // update position
    this.x -= terrainScrollSpeed * secondsElapsed;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision() {}
}
