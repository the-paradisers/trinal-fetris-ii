/* eslint-disable no-labels, class-methods-use-this, id-length */

class Board extends Phaser.Group {
  constructor(game) {
    super(game)

    this.createMatrix(10, 20)
    this.group = game.add.spriteBatch()
  }

  createMatrix(w, h) {
    this.matrix = []
    while (h--) {
      this.matrix.push(new Array(w).fill(0))
    }
  }

  draw(scale, offset) {
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
          this.group.create(
            scale * x + offset.x,
            scale * y + offset.y,
            'blocks', value)
      })
    })
  }

  sweep() {
    loop: for (let y = this.matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < this.matrix[y].length; ++x) {
        if (this.matrix[y][x] === 0){
          continue loop;
        }
      }
      const row = this.matrix.splice(y, 1)[0].fill(0)
      this.matrix.unshift(row)
      ++y
    }
    console.log('end of sweep')
  }
}

module.exports = Board
