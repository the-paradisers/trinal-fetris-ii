var Tetri = require('./Tetri.js')

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
  }

  create() {
    // values needed to handle updates
    this.currTime = 0
    this.moveTime = 0
    this.canMove = true

    // keyboard listeners
    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
    }
    this.keys.qKey.onDown.add(() => this.rotate(-1))
    this.keys.eKey.onDown.add(() => this.rotate(1))

    // board - CREATE
    this.boardState = this.add.group()
    const board = this.drawBoard([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])

    // currentBlock - CREATE
    const types = 'ILJOTSZ'
    function randomType () {
      return types[Math.floor(types.length * Math.random())]
    }

    const Blocks = new Tetri()
    this.tetrisBlock = this.add.group()
    const type = randomType()
    this.drawBlock(Blocks.getBlock(type))
    if (type === 'O') {
      this.tetrisBlock.pivot.x = 32
      this.tetrisBlock.pivot.y = 32
    } else if (type === 'I') {
      this.tetrisBlock.pivot.x = 64
      this.tetrisBlock.pivot.y = 64
    } else {
      this.tetrisBlock.pivot.x = 48
      this.tetrisBlock.pivot.y = 48
    }
  }

  // currentBlock - DRAWS BLOCK
  drawBlock(block) {
    block.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.tetrisBlock.create(32 * (x), 32 * (y), 'blocks', value)
        }
      })
    })
  }

  // boardState - DRAWS BOARD
  drawBoard(blackMatrix) {
    blackMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
          this.boardState.create(32 * x, 32 * y, 'blocks', value)
      })
    })
  }

  // clock - UPDATES AND MOVES PIECE BASED ON VARIOUS RATES
  updateClock(rate = 1) {
    // fall time
    this.currTime += this.time.elapsed * rate
    if (this.currTime > 1000){
      this.currTime = 0
      this.moveBlock(0, 1)
    }
    // movement time
    this.moveTime += this.time.elapsed
    if (this.moveTime > 250){
      this.canMove = true
      this.moveTime = 0
    }
  }

  // currentBlock - allows us to move blocks
  moveBlock(x, y) {
    // console.log(this.tetrisBlock.position)

    this.tetrisBlock.position.x += (x * 32)
    this.tetrisBlock.position.y += (y * 32)
  }

  rotate(dir) {
    this.tetrisBlock.angle += 90 * dir
  }

  update() {
    console.log(this.tetrisBlock)
    this.updateClock()

    // allows for left and right movement of current piece
    if (this.keys.leftKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(-1, 0)
      }
    } else if (this.keys.rightKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(1, 0)
      }
    } else if (this.keys.downKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(0, 1)
      }
    }

  }

  render() { }
}

module.exports = GameState
