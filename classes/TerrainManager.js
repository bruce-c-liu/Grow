import { Platform } from './terrain-types/Platform.js';
import { Hole } from './terrain-types/Hole.js';

export class TerrainManager {
  constructor(ctx, canvas, player, gameSpeed) {
    this.PLAYER = player;
    this.terrainScrollSpeed = 500 * gameSpeed;
    this.terrains = [
      new Platform(ctx, canvas, 0, canvas.height - 10),
      new Platform(ctx, canvas, 300, canvas.height - 230),
      new Hole(ctx, canvas, 300),
      new Hole(ctx, canvas, 600),
    ];

    let x = 0;

    for (let x = 900; x < 20000; x += 300) {
      this.terrains.push(new Platform(ctx, canvas, x, Math.random() * canvas.height));
      this.terrains.push(new Hole(ctx, canvas, x));
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
