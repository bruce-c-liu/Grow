import { Player } from './Player.js';
import { TerrainManager } from './TerrainManager.js';
import { UserInterface } from './UserInterface.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.gameSpeed = 1;
    this.terrainScrollSpeed = 400 * this.gameSpeed;
    this.player = new Player(ctx, this, this.terrainScrollSpeed, this.gameSpeed);
    this.terrainManager = new TerrainManager(ctx, this.player, this.terrainScrollSpeed);
    this.userInterface = new UserInterface(ctx, this.player, this.terrainScrollSpeed);

    this.timeOfLastUpdate = window.performance.now();
    this.state = 'PLAYING'; // [PLAYING, PAUSED, GAME OVER, STATS]

    // Menus and other screens
    this.gameOverScreen = document.getElementsByClassName('game-over')[0];

    // ========================================================================================================================
    // Attach Event Handlers
    // ========================================================================================================================
    document.addEventListener('keydown', (e) => {
      if (!e.repeat) {
        switch (e.key) {
          case 'w':
            this.player.jump();
            break;
          case 'a':
            this.player.strafe('left');
            break;
          case 'd':
            this.player.strafe('right');
            break;
          case 's':
            this.player.duck();
            break;
          case 'p':
            this.togglePause();
            break;
          case ' ':
            this.newGame();
            break;
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'a':
          this.player.endStrafe('left');
          break;
        case 'd':
          this.player.endStrafe('right');
          break;
        case 's':
          this.player.endDuck();
          break;
      }
    });
    // ========================================================================================================================
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
    }
  }

  gameOver() {
    this.state = 'GAME OVER';
    document.getElementById('distance-travelled').textContent = this.player.distanceTravelled;
    this.gameOverScreen.style.display = 'initial';
  }

  newGame() {
    if (this.state === 'GAME OVER') {
      this.state = 'PLAYING';
      this.gameOverScreen.style.display = 'none';
    }
  }

  updateAndDraw(timeOfUpdate) {
    const secondsElapsed = (timeOfUpdate - this.timeOfLastUpdate) / 1000;
    this.timeOfLastUpdate = timeOfUpdate;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.state) {
      case 'PLAYING':
        this.player.update(secondsElapsed);
        this.terrainManager.update(secondsElapsed);
        this.userInterface.update(secondsElapsed);
        this.player.draw();
        this.terrainManager.draw();
        this.userInterface.draw();
        break;
      case 'PAUSED':
        this.player.draw();
        this.terrainManager.draw();
        this.userInterface.draw();
        break;
      case 'GAME OVER':
        this.terrainManager.update(secondsElapsed);
        this.terrainManager.draw();
        break;
      case 'STATS':
        break;
    }

    requestAnimationFrame(this.updateAndDraw.bind(this));
  }
}
