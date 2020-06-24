export class UserInterface {
  constructor(ctx, game, player) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.player = player;
    this.game = game;

    // Menus and other screens
    this.gameOverScreen = document.getElementsByClassName('game-over')[0];

    // this.expBarGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    // this.expBarGradient.addColorStop(0, '#283048');
    // this.expBarGradient.addColorStop(1, '#514A9D');
  }

  update() {
    switch (this.game.state) {
      case 'PLAYING':
      case 'PAUSED':
        this.gameOverScreen.style.display = 'none';
        break;
      case 'GAME OVER':
        document.getElementById('distance-travelled').textContent = Math.floor(this.player.distanceTravelled);
        this.gameOverScreen.style.display = 'initial';
        break;
      case 'STATS':
        break;
    }
  }

  draw() {
    switch (this.game.state) {
      case 'GAME OVER':
      case 'PLAYING':
      case 'PAUSED':
        // UI Header
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, 22);
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(
          `Distance Travelled: ${Math.floor(this.player.distanceTravelled)}`,
          this.canvas.width / 2 - 140,
          18
        );

        // pause symbol
        if (this.game.state === 'PAUSED') {
          this.ctx.fillStyle = 'rgba(80, 80, 80, 0.8)';
          this.ctx.fillRect(this.canvas.width / 2 - 80, this.canvas.height / 2 - 100, 60, 210);
          this.ctx.fillRect(this.canvas.width / 2 + 20, this.canvas.height / 2 - 100, 60, 210);
        }
        break;
      case 'STATS':
        break;
    }

    //
  }

  showGameOverScreen() {
    document.getElementById('distance-travelled').textContent = this.player.distanceTravelled;
    this.gameOverScreen.style.display = 'initial';
  }

  hideGameOverScreen() {
    this.gameOverScreen.style.display = 'none';
  }
}
