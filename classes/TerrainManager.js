import { Platform } from './terrain-types/Platform.js';
import { Lava } from './terrain-types/Lava.js';
import { randomIntBetween, Queue } from '../utils.js';

export class TerrainManager {
  constructor(ctx, game, player, terrainScrollSpeed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.game = game;
    this.player = player;
    this.terrainScrollSpeed = terrainScrollSpeed;
    this.terrains = new Queue();

    this.terrains.enqueue(new Lava(ctx));
    this.terrains.enqueue(new Platform(ctx, 0, ctx.canvas.height / 2, 1500));

    for (let x = 1800; x < 25000; x += 250) {
      this.terrains.enqueue(
        new Platform(ctx, x, randomIntBetween(120, ctx.canvas.height - 35), randomIntBetween(25, 100))
      );
    }
  }

  update(secondsElapsed) {
    switch (this.game.state) {
      case 'PLAYING':
      case 'GAME OVER':
        // console.log(this.terrains.size);
        for (let node of this.terrains) {
          let { val: terrain } = node;
          // dequeue terrain that have travelled offscreen
          if (terrain.x + terrain.width <= 0) {
            this.terrains.remove(node);
          } else if (
            // check collision only if player is within horizontal distance of terrain
            (terrain.x <= this.player.x && this.player.x <= terrain.x + terrain.width) ||
            (terrain.x <= this.player.x + this.player.width &&
              this.player.x + this.player.width <= terrain.x + terrain.width)
          ) {
            terrain.update(secondsElapsed, true, this.player, this.terrainScrollSpeed);
          } else {
            terrain.update(secondsElapsed, false, null, this.terrainScrollSpeed);
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
