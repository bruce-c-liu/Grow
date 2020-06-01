import { Platform } from './terrain-types/Platform.js';
import { Lava } from './terrain-types/Lava.js';
import { randomBetween } from '../utils.js';

export class TerrainManager {
  constructor(ctx, player, terrainScrollSpeed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.player = player;
    this.terrainScrollSpeed = terrainScrollSpeed;
    this.terrains = [new Lava(ctx), new Platform(ctx, 0, ctx.canvas.height / 2, 1500)];

    for (let x = 1800; x < 20000; x += 300) {
      this.terrains.push(
        new Platform(ctx, x, randomBetween(40, ctx.canvas.height - 30), randomBetween(100, 200))
      );
    }
  }

  update(secondsElapsed) {
    for (let terrain of this.terrains) {
      // check collision only if player is within horizontal distance of terrain
      if (
        (terrain.x <= this.player.x && this.player.x <= terrain.x + terrain.width) ||
        (terrain.x <= this.player.x + this.player.width &&
          this.player.x + this.player.width <= terrain.x + terrain.width)
      ) {
        terrain.update(secondsElapsed, true, this.player, this.terrainScrollSpeed);
      } else {
        terrain.update(secondsElapsed, false, null, this.terrainScrollSpeed);
      }
    }
  }

  draw() {
    for (let terrain of this.terrains) {
      terrain.draw();
    }
  }
}
