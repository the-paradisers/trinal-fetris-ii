/* eslint-disable no-labels, complexity */
const Tetris = require('./Object/Tetris.js')


class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.BLOCK_SCALE = 32
  }

  create() {
    this.handleText = this.handleText.bind(this)

    this.tetris = new Tetris(this.handleGameOver.bind(this))

    // values needed to handle updates
    this.boardState = this.add.group()
    this.blockState = this.add.group()
    this.drawBlock(this.tetris.blockMatrix, this.tetris.blockPosition)
    this.drawBoard(this.tetris.board)

    // keyboard listeners
    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
    }

  }

  draw() {
    this.blockState.killAll()
    this.boardState.killAll()
    this.drawBlock(this.tetris.blockMatrix, this.tetris.blockPosition)
    this.drawBoard(this.tetris.board)
  }

  // currentBlock - DRAWS BLOCK
  drawBlock(block, offset = {x: 0, y: 0}) {
    block.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.blockState.create(
            this.BLOCK_SCALE * (x + offset.x),
            this.BLOCK_SCALE * (y + offset.y),
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
            this.BLOCK_SCALE * x,
            this.BLOCK_SCALE * y,
            'blocks', value)
      })
    })
  }

  handleText(xCord, yCord, str, options, anchor) {
    let text = this.add.text(xCord, yCord, str, options)
    text.anchor.set(anchor)
  }

  handleGameOver() {
    this.handleText(
      this.world.centerX,
      this.world.centerY,
      'Game Over',
      {fill: 'red', fontSize: 72},
      0.5
    )

    this.input.onTap.addOnce((pointer) => {
      this.world.removeAll()
      this.state.start('MainMenu')
    })
  }

  update() {
    this.tetris.clock(this.time.elapsed, 1)

    // allows for left and right movement of current piece
    if (this.keys.leftKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.move(-1)
      }
    } else if (this.keys.rightKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.move(1)
      }
    } else if (this.keys.downKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.dropBlock()
      }
    } else if (this.keys.upKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.blockRotate()
      }
    }

    this.draw()

  }

  render() {}
}

module.exports = GameState;
