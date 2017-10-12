/* eslint-disable no-labels, class-methods-use-this, id-length */
const Phaser = require('phaser-ce')
const BlockQueue = require('./BlockQueue')
const _ = require('lodash')

class Block extends Phaser.Group {
  constructor(game, board) {
    super(game)

    this.board = board

    this.queue = new BlockQueue()
    this.enemies = []
    this.numberOfEnemies = 0
    this.enemyAttacksSoFar = 0

    this.shadowGroup = game.add.group()
    this.shadowMatrix = []
    this.shadowPosition = {x: 0, y: 0}

    this.group = game.add.group()
    this.matrix = []
    this.pos = {x: 3, y: 0}

    this.initialize()
  }

  initialize() {
    this.game.signals.currentEnemies.add(this.enemyTetris, this)
    this.queue.initialize()
    this.getNextBlock()
  }

  enemyTetris(enemiezzz){
    this.enemies = enemiezzz
    this.numberOfEnemies = this.enemies.length
  }

  draw(scale, offset) {
    this.drawNext()
    this.drawShadow(scale, offset)

    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.group.create(
            scale * (x + this.pos.x) + offset.x,
            scale * (y + this.pos.y) + offset.y,
            'blocks', value)
        }
      })
    })
  }

  drawShadow(scale, offset) {
    this.shadowMatrix = _.cloneDeep(this.matrix)
    this.shadowPosition = {x: this.pos.x, y: 0}
    while (!this.shadowCollide()){
      this.shadowPosition.y++
    }
    this.shadowPosition.y--

    this.shadowMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.shadowGroup.create(
            scale * (x + this.shadowPosition.x) + offset.x,
            scale * (y + this.shadowPosition.y) + offset.y,
            'blocks', 0)
        }
      })
    })
  }

  drawNext() {
    this.queue.next().forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.group.create(
            32 * x + 860,
            32 * y + 144,
            'blocks', value)
          }
        })
      })
  }

  collide() {
    const [m, o] = [this.matrix, this.pos]
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (this.board.matrix[y + o.y] &&
            this.board.matrix[y + o.y][x + o.x]) !== 0) {
            return true
          }
      }
    }
    return false
  }

  shadowCollide() {
    const [m, o] = [this.shadowMatrix, this.shadowPosition]
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (this.board.matrix[y + o.y] &&
            this.board.matrix[y + o.y][x + o.x]) !== 0) {
            return true
          }
      }
    }
    return false
  }

  enemyAttack() {
    console.log(`inside enemy Attack`)
    console.log(this.enemies)

      this.pos.x = Math.floor(8 * Math.random())
      this.pos.y = 0
      this.matrix = this.queue.getEnemyBlock(this.enemies[this.enemyAttacksSoFar].attacks)
  }

  playerTurn () {
    this.pos = {x: 3, y: 0}
    this.matrix = this.queue.getBlock()
    if (this.collide()) {
      this.game.signals.gameOver.dispatch()
    }
  }

  getNextBlock() {
    if (((this.game.moveCount + 1) % 5) === 0 && this.enemyAttacksSoFar < this.numberOfEnemies) {
      this.game.signals.inControl.dispatch(false)
      this.enemyAttack()
      this.enemyAttacksSoFar++
    } else {
      this.game.signals.inControl.dispatch(true)
      this.playerTurn()
      this.game.moveCount++
      this.enemyAttacksSoFar = 0
    }
  }

  merge() {
    this.game.signals.hitEnemy.dispatch(this.game.playerStats.attackPower, !this.game.isInControl)
    if (this.game.isInControl){
      this.game.sounds.slash.play()
    } else {
      this.game.sounds.enemy.play()
    }

    this.game.signals.inControl.dispatch(false)
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.board.matrix[y + this.pos.y][x + this.pos.x] = value
        }
      })
    })
    this.game.signals.inControl.dispatch(true)
  }

  drop() {
    this.pos.y++
    if (this.collide()) {
      this.pos.y--
      this.merge()
      this.getNextBlock()
      this.board.sweep()
    }
  }

  fastDrop() {
    while (!this.collide()) {
      this.pos.y++
    }
    this.pos.y--
    this.merge()
    this.getNextBlock()
    this.board.sweep()
  }

  move(dir) {
    this.pos.x += dir
    if (this.collide()) {
      this.pos.x -= dir
    }
  }

  rotateMatrix(turn = true) {
    const matrix = this.matrix
    for (let y = 0; y < matrix.length; ++y) {
      for ( let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ]
      }
    }
    if (turn) {
      matrix.forEach(row => row.reverse())
    } else {
      matrix.reverse()
    }
  }

  rotate() {
    this.rotateMatrix()
    let offset = 1
    while (this.collide()) {
      this.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > this.matrix[0].length) {
        this.rotateMatrix(false)
        return;
      }
    }
  }

}

module.exports = Block
