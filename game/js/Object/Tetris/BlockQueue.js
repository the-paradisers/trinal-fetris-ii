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
        [2, 0],
        [2, 2],
      ],
      D: [
        [2, 2],
        [0, 2],
      ],
    }
  }

  addPlayerBlock() {
    const types = 'ILJOTSZI'
    const type = types[Math.floor(types.length * Math.random())]
    this.queue.push({ block: _.cloneDeep(this.playerBlocks[type]), friendly: true})
  }

  addEnemyBlock() {
    const types = 'AAAABBCD'
    const type = types[Math.floor(types.length * Math.random())]
    this.queue.push({ block: _.cloneDeep(this.enemyBlocks[type]), friendly: false})
  }

  initialize() {
    this.addPlayerBlock()
    this.addPlayerBlock()
    this.addPlayerBlock()
    this.addPlayerBlock()
  }

  getBlock() {
    console.log('inside BlockQueue.getBlock()')
    console.log(this.queue)
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
