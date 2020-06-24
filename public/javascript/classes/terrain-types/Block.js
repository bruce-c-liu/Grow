export class Block {
  constructor(ctx, x, y, width, height) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = 'white';

    this.xBuffer = 5; // A tolerance buffer for when the player is within a block
    this.yBuffer = 20; // A tolerance buffer for when the player is within a block
  }

  update(secondsElapsed, terrainScrollSpeed) {
    this.x -= terrainScrollSpeed * secondsElapsed;
  }

  resolveCollisions(player) {
    if (!(player.x + player.width - 1 < this.x || player.x > this.x + this.width - 1)) {
      const playerRightX = player.x + player.width - 1;
      const playerBottomY = player.y + player.height - 1;
      const blockRightX = this.x + this.width - 1;
      const blockBottomY = this.y + this.height - 1;

      const isAboveBlock = this.y <= playerBottomY && playerBottomY <= this.y + this.yBuffer;
      const isBelowBlock = blockBottomY - this.yBuffer <= player.y && player.y <= blockBottomY;
      const isInHorizontalZone = !(
        player.x > blockRightX - this.xBuffer || playerRightX < this.x + this.xBuffer
      );
      const isInVerticalZone = !(player.y > blockBottomY || playerBottomY < this.y);

      if (isAboveBlock && isInHorizontalZone) {
        // player lands on top of block
        player.land(this.y - player.height);
      } else if (isBelowBlock && isInHorizontalZone) {
        // player head hits bottom of block
        player.ySpeed = 0;
        player.y = this.y + this.height + 1;
      } else if (playerRightX <= this.x + this.width / 2 && isInVerticalZone) {
        // player grabs left wall
        player.ySpeed = 0;
        player.curJumps = 0;
        player.x = this.x - player.width;
      } else if (playerRightX > this.x + this.width / 2 && isInVerticalZone) {
        // player grabs right wall
        player.ySpeed = 0;
        player.curJumps = 0;
        player.x = blockRightX + 1;
      }
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
