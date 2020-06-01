// low and high are BOTH inclusive.
export function randomBetween(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
