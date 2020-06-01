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
    this.userInterface = new UserInterface(ctx, this.player);

    this.timeOfLastUpdate = window.performance.now();
    this.state = 'PLAYING'; // [PLAYING, GAME OVER, STATS]

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
          case ' ':
            if (this.state === 'GAME OVER') this.newGame();
            this.player.break;
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

  gameOver() {
    this.state = 'GAME OVER';
    const element = document.getElementsByClassName('game-over')[0];
    element.style.display = 'initial';
  }

  newGame() {
    this.state = 'PLAYING';
    const element = document.getElementsByClassName('game-over')[0];
    element.style.display = 'none';
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
