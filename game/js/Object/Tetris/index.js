/* eslint-disable no-labels, class-methods-use-this, id-length */
const Board = require('./Board')
const Block = require('./Block')
const Phaser = require('phaser-ce')

class Tetris extends Phaser.Group {

  constructor (game) {
    super(game)
    this.gameTimer = 0
    this.actionTimer = 0
    this.canMoveLeft = true
    this.canMoveRight = true
    this.canRotate = true
    this.canDrop = true
    this.canDropFast = true
    this.canPause = true

    this.blockScale = 32
    this.offset = {x: 480, y: 128}

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

  clock(elapsed, isInControl, rate = 1) {
    this.gameTimer += elapsed * Math.pow(1.15, rate - 1)
    if (isInControl && this.gameTimer > 1000){
      this.gameTimer = 0
      this.block.drop()
      this.refresh()
    } else if (!isInControl && this.gameTimer > 50) {
      this.gameTimer = 0
      this.block.drop()
      this.refresh()
    }
    // movement time
    this.actionTimer += elapsed
    if (this.actionTimer > 200){
      this.canMoveLeft = true
      this.canMoveRight = true
      this.canRotate = true
      this.canDrop = true
      this.canDropFast = true
      this.canPause = true
      this.actionTimer = 0
    }
  }

  move (command, pauseState) {
      switch (command) {
        case 'left':
          if (this.canMoveLeft){
            this.actionTimer = 0
            this.canMoveLeft = false
            this.block.move(-1)
          }
          break
        case 'right':
          if (this.canMoveRight){
            this.actionTimer = 0
            this.canMoveRight = false
            this.block.move(1)
          }
          break
        case 'drop':
          if (this.canDrop){
            this.actionTimer = 0
            this.canDrop = false
            this.block.drop()
          }
          break
        case 'rotate':
          if (this.canRotate){
            this.actionTimer = 0
            this.canRotate = false
            this.block.rotate()
          }
          break
        case 'fastDrop':
          if (this.canDropFast){
            this.actionTimer = 0
            this.canDropFast = false
            this.block.fastDrop()
          }
          break
        default:
          break
      }
      this.refresh()
  }

}

module.exports = Tetris;
