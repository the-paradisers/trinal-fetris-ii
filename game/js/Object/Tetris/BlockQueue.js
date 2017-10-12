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
    this.enemyBlocks = {
      A: [
        [2],
        [2],
      ],
      B: [
        [2, 2],
      ],
      C: [
        [2, 2],
        [2, 2],
      ],
      D: [
        [0, 3, 0],
        [3, 3, 3],
      ],
      E: [
        [4],
        [4],
        [4],
      ],
      F: [
        [5, 5, 5],
        [0, 5, 0],
      ],
      G: [
        [0, 6],
        [6, 6],
        [6, 0],
      ],
      H: [
        [6, 0],
        [6, 6],
        [0, 6],
      ],
    }
  }

  addPlayerBlock() {
    const types = 'ILJOTSZI'
    const type = types[Math.floor(types.length * Math.random())]
    this.queue.push( _.cloneDeep(this.playerBlocks[type]))
  }

  getEnemyBlock(types) {
    const type = types[Math.floor(types.length * Math.random())]
    return _.cloneDeep(this.enemyBlocks[type])
  }

  initialize() {
    this.addPlayerBlock()
  }

  getBlock() {
    this.addPlayerBlock()
    return this.queue.shift()
  }

  next() {
    if (this.queue.length > 0) {
      return this.queue[0]
    } else {
      return []
    }
  }

  length() {
    return this.queue.length
  }

}

module.exports = BlockQueue
