export class Hole {
  constructor(ctx, canvas, x) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.x = x;
    this.y = canvas.height;
    this.width = 300;
    this.height = 20;
    this.COLOR = 'white';
  }

  update(secondsElapsed, checkPlayerCollision = false, player, terrainScrollSpeed) {
    if (checkPlayerCollision) {
      if (player.yDirectionState === 'IDLE') {
        player.yDirectionState = 'FALLING';
      }
      if (player.y >= this.y) {
        // PLAYER DIED
        player.die();
      }
    }

    // update position
    this.x -= terrainScrollSpeed * secondsElapsed;
  }
  draw() {
    // it's a hole. don't need to draw.
    // TODO: remove drawing. or maybe not? Could be lava.
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.x, this.y - 5, this.width, this.height);
  }
}
