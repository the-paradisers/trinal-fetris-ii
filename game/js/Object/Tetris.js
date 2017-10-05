/* eslint-disable no-labels, class-methods-use-this, id-length */
const Tetri = require('./Tetri.js')
const Phaser = require('phaser-ce')


class Tetris extends Phaser.Group {

  constructor (game, parent, name, addToStage, enableBody, physicsBodyType) {
    super(game, parent, name, addToStage, enableBody, physicsBodyType)
    this.gameTimer = 0
    this.actionTimer = 0
    this.canMove = true

    this.BLOCK_SCALE = 32
    this.blocks = new Tetri()
    this.blockMatrix = this.blocks.getRandomBlock()
    this.blockPosition = {x: 3, y: 0};

    this.board = this.createBoard(10, 20)

    this.boardState = game.add.group()
    this.blockState = game.add.group()

    // Tetris board offset
    this.boardOffset = {x: 400, y: 64}
  }

  draw() {
    this.blockState.killAll()
    this.boardState.killAll()
    this.drawBlock(this.blockMatrix, this.blockPosition)
    this.drawBoard(this.board)
  }

    // currentBlock - DRAWS BLOCK
    drawBlock(block, offset = {x: 0, y: 0}) {
      block.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            this.blockState.create(
              this.BLOCK_SCALE * (x + offset.x) + this.boardOffset.x,
              this.BLOCK_SCALE * (y + offset.y) + this.boardOffset.y,
              'blocks', value)
          }
        })
      })
    }
    // tetrisBoard - DRAWS BOARD
    drawBoard(board) {
      board.forEach((row, y) => {
        row.forEach((value, x) => {
            this.boardState.create(
              this.BLOCK_SCALE * x + this.boardOffset.x,
              this.BLOCK_SCALE * y + this.boardOffset.y,
              'blocks', value)
        })
      })
    }

  boardSweep() {
    outer: for (let y = this.board.length - 1; y > 0; --y) {
      for (let x = 0; x < this.board[y].length; ++x) {
        if (this.board[y][x] === 0){
          continue outer;
        }
      }
      const row = this.board.splice(y, 1)[0].fill(0)
      this.board.unshift(row)
      ++y
    }
  }

  clock(elapsed, rate = 1) {
    // fall time
    this.gameTimer += elapsed * rate
    if (this.gameTimer > 1000){
      this.gameTimer = 0
      this.dropBlock()
    }
    // movement time
    this.actionTimer += elapsed
    if (this.actionTimer > 200){
      this.canMove = true
    }
  }

  collide() {
    const [m, o] = [this.blockMatrix, this.blockPosition]
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (this.board[y + o.y] &&
            this.board[y + o.y][x + o.x]) !== 0) {
            return true
          }
      }
    }
    return false
  }

  createBoard(w, h) {
    const newMatrix = []
    while (h--) {
      newMatrix.push(new Array(w).fill(0))
    }
    return newMatrix
  }

  merge() {
    this.blockMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.board[y + this.blockPosition.y][x + this.blockPosition.x] = value
        }
      })
    })
  }

  move(dir) {
    this.blockPosition.x += dir
    if (this.collide()) {
      this.blockPosition.x -= dir
    }
  }

  // blockMatrix - allows us to move blocks
  dropBlock() {
    this.blockPosition.y++
    if (this.collide()) {
      this.blockPosition.y--
      this.merge()
      this.newBlock()
      this.boardSweep()
    }
  }

  rotate(turn = true) {
    const matrix = this.blockMatrix
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

  newBlock() {
    this.blockMatrix = this.blocks.getRandomBlock()
    this.blockPosition = {x: 3, y: 0}
    // if (this.collide()) {
    //   this.handleGameOver()
    // }
  }

  blockRotate() {
    this.rotate()
    let offset = 1
    while (this.collide()) {
      this.blockPosition.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > this.blockMatrix[0].length) {
        this.rotate(false)
        return;
      }
    }
  }

  startCooldown () {
    this.canMove = false
    this.actionTimer = 0
  }

}

module.exports = Tetris;
