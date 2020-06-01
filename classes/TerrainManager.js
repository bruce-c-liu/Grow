import { Platform } from './terrain-types/Platform.js';
import { Lava } from './terrain-types/Lava.js';
import { randomBetween } from '../utils.js';

export class TerrainManager {
  constructor(ctx, canvas, player, terrainScrollSpeed) {
    this.PLAYER = player;
    this.terrainScrollSpeed = terrainScrollSpeed;
    this.terrains = [new Platform(ctx, canvas, 0, canvas.height / 2, 1500), new Lava(ctx, canvas)];

    for (let x = 1800; x < 20000; x += 300) {
      this.terrains.push(
        new Platform(ctx, canvas, x, randomBetween(40, canvas.height - 30), randomBetween(100, 200))
      );
    }
  }

  update(secondsElapsed) {
    for (let terrain of this.terrains) {
      // check collision only if player is within horizontal distance of terrain
      if (
        (terrain.x <= this.PLAYER.x && this.PLAYER.x <= terrain.x + terrain.width) ||
        (terrain.x <= this.PLAYER.x + this.PLAYER.width &&
          this.PLAYER.x + this.PLAYER.width <= terrain.x + terrain.width)
      ) {
        terrain.update(secondsElapsed, true, this.PLAYER, this.terrainScrollSpeed);
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
