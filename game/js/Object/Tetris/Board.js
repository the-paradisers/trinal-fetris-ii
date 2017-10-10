/* eslint-disable no-labels, class-methods-use-this, id-length */

class Board extends Phaser.Group {
  constructor(game) {
    super(game)
    this.game.addBottomRow = this.addBottomRow.bind(this)
    this.game.clearBottomRows = this.clearBottomRows.bind(this)
    this.createMatrix(10, 18)
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
        if (value !== 0){
          this.group.create(
            scale * x + offset.x,
            scale * y + offset.y,
            'blocks', value)
        }
      })
    })
  }

  sweep() {
    let linesCleared = 0
    loop: for (let y = this.matrix.length - 1; y > 0; --y) {
      for (let x = 0; x < this.matrix[y].length; ++x) {
        if (this.matrix[y][x] === 0){
          continue loop;
        }
      }
      const row = this.matrix.splice(y, 1)[0].fill(0)
      this.matrix.unshift(row)
      ++y

      // Dispatch signal to damage target
      linesCleared++
    }
    this.game.signals.addMana.dispatch(linesCleared)
    //playerlvl = player basic damage
    if (this.game.signals.hitEnemy) {
      this.game.signals.hitEnemy.dispatch(this.game.player.playerlvl)
    }
  }

  addBottomRow () {
    const w = this.matrix[0].length
    const randomIdx = Math.floor(w * Math.random())
    const newRow = new Array(w).fill(1)
    newRow[randomIdx] = 0
    this.matrix.push(newRow)
    this.matrix.shift()
  }

  clearBottomRows (numLines) {
    const w = this.matrix[0].length
    for (let i = 0; i < numLines; i++) {
      this.matrix.unshift(new Array(w).fill(0))
      this.matrix.pop()
    }
  }
}

module.exports = Board
