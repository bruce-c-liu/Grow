import { Player } from './Player.js';
import { TerrainManager } from './TerrainManager.js';
import { UserInterface } from './UserInterface.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    ctx.font = '20px Orbitron';

    this.gameSpeed = 1;
    // this.terrainScrollSpeed = 400 * this.gameSpeed;
    this.terrainScrollSpeed = 100 * this.gameSpeed;
    this.player = new Player(ctx, this, this.terrainScrollSpeed, this.gameSpeed);
    this.terrainManager = new TerrainManager(ctx, this, this.player, this.terrainScrollSpeed);
    this.userInterface = new UserInterface(ctx, this, this.player);

    this.timeOfLastUpdate = window.performance.now();
    this.state = 'PLAYING'; // [PLAYING, PAUSED, GAME OVER, STATS]

    // ========================================================================================================================
    // Attach Event Handlers
    // ========================================================================================================================
    document.addEventListener('keydown', ({ repeat, key }) => {
      if (!repeat) {
        // only allow jumping when PLAYING
        if (this.state === 'PLAYING') {
          switch (key) {
            case 'w':
              this.player.jump();
              break;
          }
        }

        // allow buffering of strafe/ducking when PAUSED
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          switch (key) {
            case 'a':
              this.player.strafe('left');
              break;
            case 'd':
              this.player.strafe('right');
              break;
            case 's':
              this.player.setIsDucking(true);
              break;
            case 'p':
              this.togglePause();
              break;
          }
        }

        if (this.state === 'GAME OVER' && key === ' ') {
          this.newGame();
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
          this.player.setIsDucking(false);
          break;
      }
    });
    // ========================================================================================================================
  }

  togglePause() {
    this.state = this.state === 'PAUSED' ? 'PLAYING' : 'PAUSED';
  }

  gameOver() {
    this.state = 'GAME OVER';
  }

  newGame() {
    this.state = 'PLAYING';
    this.player.reset();
  }

  updateAndDraw(timeOfUpdate) {
    const secondsElapsed = (timeOfUpdate - this.timeOfLastUpdate) / 1000;
    this.timeOfLastUpdate = timeOfUpdate;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.update(secondsElapsed);
    this.terrainManager.update(secondsElapsed);
    this.userInterface.update(secondsElapsed);
    this.player.draw();
    this.terrainManager.draw();
    this.userInterface.draw();

    requestAnimationFrame(this.updateAndDraw.bind(this));
  }
}
