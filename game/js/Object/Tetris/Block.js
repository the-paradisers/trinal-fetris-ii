/* eslint-disable no-labels, class-methods-use-this, id-length */
const Phaser = require('phaser-ce')
const BlockQueue = require('./BlockQueue')

class Block extends Phaser.Group {
  constructor(game, board) {
    super(game)

    this.board = board

    this.queue = new BlockQueue()
    this.enemies = []
    this.numberOfEnemies = 0
    this.enemyAttacksSoFar = 0

    this.group = game.add.group()
    this.matrix = []
    this.pos = {x: 3, y: 0}

    this.beingAttacked = false

    this.initialize()
  }

  initialize() {
    this.game.signals.currentEnemies.add(this.enemyTetris, this)
    this.queue.initialize()
    this.getNextBlock()
  }

  enemyTetris(enemiezzz){
    this.enemies = enemiezzz
    // console.log(`tetris enemies: ${this.enemies.length}`)
    this.numberOfEnemies = this.enemies.length
  }

  draw(scale, offset) {
    this.drawNext()
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

  gameover() {
    let gameover = this.game.add.text(
      640,
      360,
      'Game Over',
      {fill: 'red', fontSize: 72}
    )
    gameover.anchor.set(0.5)

    this.game.input.onTap.addOnce(() => {
      this.game.paused = false
      this.game.world.removeAll()
      this.game.state.start('TitleMenu')
    })
  }

  enemyAttack() {
    this.beingAttacked = true
    this.game.signals.inControl.dispatch(false)
    console.log('number of enemies attacking', this.enemies.length)
    // for (let i = 0; i < this.enemies.length; i++){
      this.pos.x = Math.floor(8 * Math.random())
      this.pos.y = 0
      this.matrix = this.queue.getEnemyBlock()
    // }
    // this.enemies.forEach(() => {
    //   this.matrix = this.queue.getEnemyBlock()
    //   this.fastDrop()
    // })
    this.beingAttacked = false
  }

  playerTurn () {
    this.pos = {x: 3, y: 0}
    this.matrix = this.queue.getBlock()
    if (this.collide()) {
      this.game.paused = true
      this.gameover()
    }
  }

  getNextBlock() {
    // console.log(`inside getNextBlock - queue length`)
    // console.log(this.queue.length())
    if (((this.game.moveCount + 1) % 5) === 0) {
      // console.log(`checking to do an enemy attack`)
      // console.log('Number of Enemies:', this.numberOfEnemies)
      // console.log('Enemy Attacks')
      if (this.enemyAttacksSoFar < this.numberOfEnemies) {
        // console.log(`enemy attack`)
        this.enemyAttacksSoFar++
        this.enemyAttack()
      } else {
        // console.log(`no enemy attack`)
        this.game.moveCount++
        this.enemyAttacksSoFar = 0
      }
    } else {
      // console.log(`player turn`)
      this.playerTurn()
      this.game.moveCount++
    }
  }

  merge() {
    // console.log('inside merge - moveCount')
    // console.log(this.game.moveCount)
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
