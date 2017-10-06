/* eslint-disable id-length */
const _ = require('lodash')

class BlockQueue {
  constructor() {
    this.queue = []
    this.playerBlocks = {
      T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      I: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      L: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      J: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      S: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      Z: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
    }
  }

  add() {
    const types = 'ILJOTSZI'
    const type = types[Math.floor(types.length * Math.random())]
    this.queue.push(_.cloneDeep(this.playerBlocks[type]))
  }

  initialize() {
    this.add()
    this.add()
    this.add()
  }

  new() {
    this.add()
    return this.queue.shift()
  }

  next() {
    if (this.queue.length > 0) {
      return this.queue[0]
    } else {
      return []
    }
  }

}

module.exports = BlockQueue
