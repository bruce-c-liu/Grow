// [low, high]
function randomIntBetween(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

// [low, high)
function randomFloatBetween(low, high) {
  return Math.random() * (high - low) + low;
}

// ========================================================================================================================
// Queue implementation: Uses circular doubly linkedlist. Iterable.
// ========================================================================================================================
class Node {
  constructor(val, next = this, prev = this) {
    this.val = val;
    this.next = next;
    this.prev = prev;
  }
}

class Queue {
  constructor() {
    this.dummy = new Node(null);
    this.size = 0;
  }

  enqueue(val) {
    let node = new Node(val);

    node.next = this.dummy.next;
    node.prev = this.dummy;

    this.dummy.next = node;
    node.next.prev = node;
    this.size++;
  }

  dequeue() {
    if (this.dummy.next === this.dummy) {
      return null;
    }

    this.dummy.prev = this.dummy.prev.prev;
    this.dummy.prev.next = this.dummy;
    this.size--;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }

  // Iterates and returns Nodes. Does NOT return node.val.
  // NOTE: Even though this is a queue, it iterates starting from LAST enqueued item.
  // Why? Lava must be the last drawn item, even though it's always at the front of the queue.
  [Symbol.iterator]() {
    return {
      current: this.dummy.next,
      dummy: this.dummy,

      next() {
        if (this.current !== this.dummy) {
          this.current = this.current.next;
          return { done: false, value: this.current.prev };
        } else {
          return { done: true };
        }
      },
    };
  }
}

export { randomIntBetween, randomFloatBetween, Queue };
