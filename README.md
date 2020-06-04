# Grow

Roguelite sidescroller game where you get stronger every run!

Play at: https://bruce-c-liu.github.io/Grow/

## Contributing

Ideas and suggestions are welcome by opening issues. :)

## Patch Notes

##### 6/3/20

###### NEW

- Added dash mechanic!
  - Press SPACE to dash.
  - Player will dash horizontally in the direction that it is currently moving in.
  - By default, dashing while standing dashes to the right.
  - If player dashes into a block, you will wall grab whichever side you are closer to.
    - It is also possible to completely dash through a block.
- Added dash tail.
  - Should help players like Cat learn dash range faster.

###### CHANGED

- Restart game key changed from SPACE to ENTER.

###### BUG FIX

- Player now properly loses speed when wall sliding on left side of blocks.
- Distance Travelled info is now accurate.
- Jump tail now shows when ducking.

---

##### 6/2/20

###### NEW

- Added Pause indicator on pause.
- Allow buffering of ducking and strafing during pause.
- Blocks are now completely solid!
  - Player can not jump through block from bottom or sides.
- Added wall grabbing/sliding!
  - Jumps are reset while on wall.

###### CHANGED

- Improved Game Over screen contrast.
- Blocks now have dynamic height.

###### UNDER THE HOOD

- Changed terrain storage from array to Circular Doubly LinkedList.
  - Greatly speeds up deletion operation. O(n) -> O(1)
- Terrains are now deallocated when offscreen.
  - Significant reduction in memory usage.
- Terrains are now created only when required!
  - Should speed up game initialization.
  - Huge decrease in required memory/processing during gameplay.
- Improved collision detection algorithm.
  - Makes fewer unnecessary checks.

###### BUG FIX

- Hitbox while ducking now properly aligns with player avatar.
- Player no longer "clips" into the block when wall sliding.

---

##### 6/1/20

###### NEW

- Added Game Over screen.
- Added Pause function. Just press P during a run.
- Added UI header that shows distance travelled!
- Added jump "tail" to indicate how many jumps have occurred in midair.
- Game Over screen shows after all lives are spent.

###### CHANGED

- Blocks are now much narrower.
- Max lives changed from unlimited to 3.
- Lava is now animated!
- Midair max jumps from unlimited to 2.
- Blocks now have dynamic width.
