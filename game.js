import { Player } from './classes/Player.js';
import { TerrainManager } from './classes/TerrainManager.js';

window.onload = (function () {
  const canvas = document.getElementById('game-window');
  const ctx = canvas.getContext('2d');
  let timeOfLastUpdate = window.performance.now();

  // ========================================================================================================================
  // Game Variables
  // ========================================================================================================================
  const GAME_SPEED = 1;
  const TERRAIN_SCROLL_SPEED = 400 * GAME_SPEED;
  const PLAYER = new Player(ctx, canvas, TERRAIN_SCROLL_SPEED, GAME_SPEED);
  const TERRAIN_MANAGER = new TerrainManager(ctx, canvas, PLAYER, TERRAIN_SCROLL_SPEED);

  // ========================================================================================================================
  // Attach Event Handlers
  // ========================================================================================================================
  document.addEventListener('keydown', (e) => {
    if (!e.repeat) {
      switch (e.key) {
        case 'w':
          PLAYER.jump();
          break;
        case 'a':
          PLAYER.strafe('left');
          break;
        case 'd':
          PLAYER.strafe('right');
          break;
        case 's':
          PLAYER.duck();
          break;
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      // case 'w':
      //   player.jump();
      //   break;
      case 'a':
        PLAYER.endStrafe('left');
        break;
      case 'd':
        PLAYER.endStrafe('right');
        break;
      case 's':
        PLAYER.endDuck();
        break;
    }
  });

  // ========================================================================================================================
  // Start Game Loop
  // ========================================================================================================================
  requestAnimationFrame(update);

  function update(timeOfUpdate) {
    const secondsElapsed = (timeOfUpdate - timeOfLastUpdate) / 1000;
    timeOfLastUpdate = timeOfUpdate;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update all objects
    PLAYER.update(secondsElapsed);
    TERRAIN_MANAGER.update(secondsElapsed);

    // draw all objects
    PLAYER.draw();
    TERRAIN_MANAGER.draw();
    requestAnimationFrame(update);
  }
})();
