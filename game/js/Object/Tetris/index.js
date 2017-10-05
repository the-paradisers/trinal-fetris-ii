/* eslint-disable no-labels, class-methods-use-this, id-length */
const Board = require('./Board')
const Block = require('./Block')
const Phaser = require('phaser-ce')


class Tetris extends Phaser.Group {

  constructor (game) {
    super(game)
    this.gameTimer = 0
    this.actionTimer = 0
    this.canMove = true

    this.blockScale = 32
    this.offset = {x: 480, y: 64}

    this.board = new Board(game)
    this.block = new Block(game, this.board)

  }

  draw() {
    this.board.draw(this.blockScale, this.offset)
    this.block.draw(this.blockScale, this.offset)
  }

  refresh() {
    this.board.group.removeAll()
    this.block.group.removeAll()
    this.draw()
  }

  clock(elapsed, rate = 1) {
    // fall time
    this.gameTimer += elapsed * rate
    if (this.gameTimer > 1000){
      this.gameTimer = 0
      this.block.drop()
      this.refresh()
    }
    // movement time
    this.actionTimer += elapsed
    if (this.actionTimer > 200){
      this.canMove = true
    }
  }

  move (command) {
    if (this.canMove) {
      this.canMove = false
      this.actionTimer = 0
      switch (command) {
        case 'left':
          this.block.move(-1)
          break
        case 'right':
          this.block.move(1)
          break
        case 'drop':
          this.block.drop()
          break
        case 'rotate':
          this.block.rotate()
          break
        default:
          break
      }
      this.refresh()
    }
  }

}

module.exports = Tetris;
