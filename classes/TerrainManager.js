import { Block } from './terrain-types/Block.js';
import { Lava } from './terrain-types/Lava.js';
import { randomIntBetween, Queue } from '../utils.js';

export class TerrainManager {
  constructor(ctx, game, player, terrainScrollSpeed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.game = game;
    this.player = player;
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
    this.rightMostBlock = new Block(ctx, 0, ctx.canvas.height / 2 + 250, 1200, 30); // tracked so we know when to generate new terrain/blocks
    this.terrains = new Queue();

    this.terrains.enqueue(new Lava(ctx));
    this.terrains.enqueue(this.rightMostBlock);
    this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2 + 230, 200, 20));
    this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10, 200, 150));
    this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 - 400, ctx.canvas.height / 2 + 160, 200, 20));
    this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 - 400, ctx.canvas.height / 2 + 200, 200, 120));
    this.terrains.enqueue(new Block(ctx, ctx.canvas.width / 2 + 200, ctx.canvas.height / 2 - 200, 10, 20));
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
            terrain.resolveCollisions(this.player);
          }
        }

        // generate new terrain if required
        if (this.rightMostBlock.x + this.rightMostBlock.width <= this.canvas.width - 300) {
          this.rightMostBlock = new Block(
            this.ctx,
            this.canvas.width,
            randomIntBetween(140, this.canvas.height - 35),
            randomIntBetween(25, 200),
            randomIntBetween(25, 200)
          );

          this.terrains.enqueue(this.rightMostBlock);
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
