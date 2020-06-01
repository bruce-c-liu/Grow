export class Platform {
  constructor(ctx, canvas, x, y, type) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.x = x;
    this.y = y;
    this.width = 300;
    this.height = 20;
    this.COLOR = 'white';
  }

  update(secondsElapsed, checkPlayerCollision = false, player, terrainScrollSpeed) {
    if (checkPlayerCollision) {
      let playerBottomY = player.y + player.height;

      // player above platform
      if (player.state === 'FALLING' && this.y <= playerBottomY && playerBottomY <= this.y + this.height) {
        player.land(this.y - player.height);
      } else if (player.state === 'IDLE') {
        player.state = 'FALLING';
      }
    }

    // update position
    this.x -= terrainScrollSpeed * secondsElapsed;
  }

  draw() {
    this.ctx.fillStyle = this.COLOR;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision() {}
}
