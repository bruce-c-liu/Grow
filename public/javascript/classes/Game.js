import { Player } from './Player.js';
import { TerrainManager } from './TerrainManager.js';
import { UserInterface } from './UserInterface.js';

const backgroundMusic = new Audio('../sounds/bgm/last-cyber-dance.ogg');
backgroundMusic.volume = 0.25;

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    ctx.font = '20px Orbitron';

    this.gameSpeed = 1;
    this.terrainScrollSpeed = 0 * this.gameSpeed;
    this.player = new Player({
      ctx: ctx,
      game: this,
      terrainScrollSpeed: this.terrainScrollSpeed,
      gameSpeed: this.gameSpeed,
      isSelf: true,
    });
    this.players = { self: this.player };
    this.terrainManager = new TerrainManager(ctx, this, this.players, this.terrainScrollSpeed);
    this.userInterface = new UserInterface(ctx, this, this.player);

    this.timeOfLastUpdate = window.performance.now();
    this.state = 'PLAYING'; // [PLAYING, PAUSED, GAME OVER, STATS]

    this.keysDown = new Set();

    // ========================================================================================================================
    // Set up sockets
    // ========================================================================================================================
    const socket = io.connect();

    socket.on('playerConnected', ({ id }) => {
      this.players[id] = new Player({
        ctx: ctx,
        game: this,
        terrainScrollSpeed: this.terrainScrollSpeed,
        gameSpeed: this.gameSpeed,
        isSelf: false,
      });
      console.log(`new player joined: ${id}`);

      // socket.emit('playerCreated', this.players);
    });

    socket.on('playersInRoom', (playerIDs) => {
      for (let id of playerIDs) {
        this.players[id] = new Player({
          ctx: ctx,
          game: this,
          terrainScrollSpeed: this.terrainScrollSpeed,
          gameSpeed: this.gameSpeed,
          isSelf: false,
        });
      }
    });

    setInterval(() => {
      socket.emit('playerPositionUpdated', { x: this.player.x, y: this.player.y });
    }, 1000 / 60);

    socket.on('playerPositionUpdated', ({ id, x, y }) => {
      this.players[id].x = x;
      this.players[id].y = y;
    });

    socket.on('playerDisconnected', ({ id }) => {
      delete this.players[id];
      console.log(`player disconnected: ${id}`);
    });

    // ========================================================================================================================
    // Attach Event Handlers
    // ========================================================================================================================
    document.addEventListener('keydown', ({ repeat, key }) => {
      if (!repeat) {
        this.keysDown.add(key);

        // TODO: Fix this. This is a temporary hack.
        if (key === 'm') {
          if (backgroundMusic.paused) {
            backgroundMusic.play();
          } else {
            backgroundMusic.pause();
          }
        }

        // only allow jumping/dashing when PLAYING
        if (this.state === 'PLAYING') {
          switch (key) {
            case 'w':
              this.player.jump();
              break;
            case ' ':
              this.player.dash();
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

        if (this.state === 'GAME OVER' && key === 'Enter') {
          this.newGame();
        }
      }
    });

    document.addEventListener('keyup', ({ key }) => {
      this.keysDown.delete(key);

      switch (key) {
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

    // Update all objects
    for (let player of Object.values(this.players)) {
      player.update(secondsElapsed);
    }
    // TODO: REMOVE?
    // this.player.update(secondsElapsed);
    this.terrainManager.update(secondsElapsed);
    this.userInterface.update(secondsElapsed);

    // Draw all objects
    for (let player of Object.values(this.players)) {
      player.draw();
    }
    // TODO: REMOVE?
    // this.player.draw();
    this.terrainManager.draw();
    this.userInterface.draw();

    requestAnimationFrame(this.updateAndDraw.bind(this));
  }
}
