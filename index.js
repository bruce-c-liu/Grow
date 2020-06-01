import { Game } from './classes/Game.js';

window.onload = function () {
  const canvas = document.getElementById('game-window');
  const ctx = canvas.getContext('2d');

  const GAME = new Game(ctx);
  // ========================================================================================================================
  // Start Game Loop
  // ========================================================================================================================
  requestAnimationFrame(GAME.updateAndDraw.bind(GAME));
};
