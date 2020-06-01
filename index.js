import { Game } from './classes/Game.js';

window.onload = (function () {
  const canvas = document.getElementById('game-window');
  const ctx = canvas.getContext('2d');

  // GAME object manages the entire game
  const GAME = new Game(ctx);

  // ========================================================================================================================
  // Start Game Loop
  // ========================================================================================================================
  let timeOfLastUpdate = window.performance.now();
  requestAnimationFrame(update);

  function update(timeOfUpdate) {
    const secondsElapsed = (timeOfUpdate - timeOfLastUpdate) / 1000;
    timeOfLastUpdate = timeOfUpdate;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    GAME.update(secondsElapsed);
    GAME.draw();
    requestAnimationFrame(update);
  }
  // ========================================================================================================================
})();
