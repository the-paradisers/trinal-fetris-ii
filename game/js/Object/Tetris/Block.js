/* eslint-disable no-labels, class-methods-use-this, id-length */
const Phaser = require('phaser-ce')
const BlockQueue = require('./BlockQueue')

class Block extends Phaser.Group {
  constructor(game, board) {
    super(game)

    // this.game = game

    this.board = board

    this.queue = new BlockQueue()
    this.queue.add()

    this.group = game.add.group()
    this.matrix = []
    this.new()
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
            32 * x + 900,
            32 * y + 64,
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
      this.game.world.removeAll()
      this.game.state.start('TitleMenu')
    })
  }

  new() {
    this.matrix = this.queue.new()
    this.pos = {x: 3, y: 0}
    if (this.collide()) {
      this.gameover()
    }
  }

  merge() {
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.board.matrix[y + this.pos.y][x + this.pos.x] = value
        }
      })
    })
  }

  drop() {
    this.pos.y++
    if (this.collide()) {
      this.pos.y--
      this.merge()
      this.new()
      this.board.sweep()
    }
  }

  fastDrop() {
    while (!this.collide()) {
      this.pos.y++
    }
    this.pos.y--
    this.merge()
    this.new()
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
