import { Block } from './terrain-types/Block.js';
import { Lava } from './terrain-types/Lava.js';
import { randomIntBetween, Queue } from '../utils.js';

export class TerrainManager {
  constructor(ctx, game, players, terrainScrollSpeed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.game = game;
    this.players = players;
    this.terrainScrollSpeed = terrainScrollSpeed;

    // ========================================================================================================================
    // Actual Code (TODO: Remove this header)
    // ========================================================================================================================
    // this.rightMostBlock = new Block(ctx, 0, ctx.canvas.height / 2, 1200, 30); // track so we know when to generate new terrain/blocks
    // this.terrains = new Queue();

    // this.terrains.enqueue(new Lava(ctx));
    // this.terrains.enqueue(this.rightMostBlock);

    // ========================================================================================================================
    // Sandbox Mode (Comment out above)
    // ========================================================================================================================
    this.terrains = new Queue();

    this.terrains.enqueue(new Lava(ctx));
    const terrains = [
      new Block(ctx, 0, 350, 1200, 300),
      //--------------------------------------
      // new Block(ctx, 1500, 350, 200, 40),
      // new Block(ctx, 2500, 350, 200, 40),
      //--------------------------------------
      // new Block(ctx, 1700, -2000, 800, 2300),
      // new Block(ctx, 2650, 500, 200, 40),
      //--------------------------------------
      new Block(ctx, 1400, -2000, 160, 2200),
      new Block(ctx, 2400, -2000, 160, 2300),
      new Block(ctx, 3400, -2000, 160, 2400),
      new Block(ctx, 4400, -2000, 160, 2450),
    ];

    for (let terrain of terrains) {
      this.terrains.enqueue(terrain);
    }

    // this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2 + 230, 200, 20));
    // this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10, 200, 150));
    // this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 - 400, ctx.canvas.height / 2 + 160, 200, 20));
    // this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 - 400, ctx.canvas.height / 2 + 200, 200, 120));
    // this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 + 200, ctx.canvas.height / 2 - 200, 10, 20));
  }

  update(secondsElapsed) {
    switch (this.game.state) {
      case 'PLAYING':
      case 'GAME OVER':
        // update terrain and check for collisions
        for (let node of this.terrains) {
          let { val: terrain } = node;

          if (terrain.x + terrain.width <= 0) {
            // delete terrain that have travelled offscreen
            this.terrains.remove(node);
          } else {
            terrain.update(secondsElapsed, this.terrainScrollSpeed);

            for (let player of Object.values(this.players)) {
              terrain.resolveCollisions(player);
            }
          }
        }
        break;
      case 'PAUSED':
        break;
      case 'STATS':
        break;
    }
  }

  draw() {
    switch (this.game.state) {
      case 'PLAYING':
      case 'GAME OVER':
      case 'PAUSED':
        for (let { val: terrain } of this.terrains) {
          terrain.draw();
        }
        break;
      case 'STATS':
        break;
    }
  }
}
