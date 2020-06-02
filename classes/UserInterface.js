export class UserInterface {
  constructor(ctx, player, terrainScrollSpeed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.player = player;

    this.state = 'PLAYING'; // [PLAYING, GAME OVER, STATS]

    // this.expBarGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    // this.expBarGradient.addColorStop(0, '#283048');
    // this.expBarGradient.addColorStop(1, '#514A9D');
  }

  update(secondsElapsed) {}

  draw() {
    // this.ctx.fillStyle = this.expBarGradient;
    // this.ctx.fillRect(0, 0, this.canvas.width-1000, 12);

    switch (this.state) {
      case 'PLAYING':
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, 12);
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Distance Travelled ${this.player.distanceTravelled}`, this.canvas.width / 2 - 25, 10);
        break;
      case 'GAME OVER':
        break;
      case 'STATS':
        break;
    }
  }
}
