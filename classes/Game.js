import { Player } from './Player.js';
import { TerrainManager } from './TerrainManager.js';
import { UserInterface } from './UserInterface.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    this.gameSpeed = 1;
    this.terrainScrollSpeed = 400 * this.gameSpeed;
    this.player = new Player(ctx, this.terrainScrollSpeed, this.gameSpeed);
    this.terrainManager = new TerrainManager(ctx, this.player, this.terrainScrollSpeed);
    this.userInterface = new UserInterface(ctx, this.player);

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

  update(secondsElapsed) {
    // update all objects
    this.player.update(secondsElapsed);
    this.terrainManager.update(secondsElapsed);
    this.userInterface.update(secondsElapsed);
  }

  draw() {
    // this.ctx.fillStyle = this.expBarGradient;
    // this.ctx.fillRect(0, 0, this.canvas.width-1000, 12);

    switch (this.state) {
      case 'PLAYING':
        this.player.draw();
        this.terrainManager.draw();
        this.userInterface.draw();
        break;
      case 'GAME OVER':
        break;
      case 'STATS':
        break;
    }
  }
}
