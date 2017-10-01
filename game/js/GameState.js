var Tetri = require('./Tetri.js')

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
  }

  create() {
    this.currTime = this.time.now / 10

    const Blocks = new Tetri()
    const myB = Blocks.getBlock('L')

    this.drawBoard(
      [
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
      ]
    )

    this.drawBlock(myB)

  }

  drawBlock(blackMatrix) {
    blackMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.add.sprite(32 * x + 480, 32 * y + 80, 'blocks', value)
        }
      })
    })
  }

  drawBoard(blackMatrix) {
    blackMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
        // if (value !== 0) {
          this.add.sprite(32 * x + 480, 32 * y + 80, 'blocks', value)
        // }
      })
    })
  }

  update() {
    this.currTime++
    if (this.currTime >= 60) {
      this.currTime = 0
    }
    console.log(this.currTime)
  }

  render() { }
}

module.exports = GameState
