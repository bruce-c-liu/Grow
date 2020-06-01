import { randomFloatBetween } from '../../utils.js';

export class Lava {
  constructor(ctx) {
    this.chunks = []; // chunks are simply individual rectangles that make up the lava
    this.CHUNK_WIDTH = 25;
    this.MAX_CHUNK_HEIGHT = 13;
    this.MIN_CHUNK_HEIGHT = 8;

    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.width = ctx.canvas.width;
    this.height = this.MAX_CHUNK_HEIGHT;
    this.x = 0;
    this.y = ctx.canvas.height - this.height;
    this.color = 'red';

    for (let x = 0; x <= ctx.canvas.width - this.CHUNK_WIDTH; x += this.CHUNK_WIDTH) {
      this.chunks.push({
        x: x,
        y: randomFloatBetween(
          ctx.canvas.height - this.MAX_CHUNK_HEIGHT,
          ctx.canvas.height - this.MIN_CHUNK_HEIGHT
        ),
        dy: randomFloatBetween(-1.5, 1.5),
      });
    }
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
    for (let chunk of this.chunks) {
      if (chunk.y <= this.canvas.height - this.MAX_CHUNK_HEIGHT || chunk.y >= this.canvas.height - this.MIN_CHUNK_HEIGHT) {
        chunk.dy = -chunk.dy;
      }

      chunk.y += chunk.dy;
      this.ctx.fillRect(chunk.x, chunk.y, this.CHUNK_WIDTH, this.height);
    }
  }
}
