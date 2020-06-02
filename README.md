# Grow

Roguelite sidescroller game where you get stronger every run!

Play at: https://bruce-c-liu.github.io/Grow/

## Contributing

Ideas and suggestions are welcome by opening issues. :)

## Patch Notes

##### 6/2/20

###### NEW

- Added Pause indicator on pause.
- Allow buffering of ducking and strafing during pause.

###### CHANGED

- Improved Game Over screen contrast.

###### UNDER THE HOOD

- Changed terrain storage from array to Circular Doubly LinkedList
  - Greatly speeds up deletion operation. O(n) -> O(1)
- Terrains are now deallocated when offscreen.
  - Significant reduction in memory usage.

---

##### 6/1/20

###### NEW

- Added Game Over screen.
- Added Pause function. Just press P during a run.
- Added UI header that shows distance travelled!
- Added jump "tail" to indicate how many jumps have occurred in midair.
- Game Over screen shows after all lives are spent.

###### CHANGED

- Platforms are now much narrower.
- Max lives changed from unlimited to 3.
- Lava is now animated!
- Midair max jumps from unlimited to 2.
- Platforms now have dynamic width.
