// [low, high]
export function randomIntBetween(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

// [low, high)
export function randomFloatBetween(low, high) {
  return Math.random() * (high - low) + low;
}
