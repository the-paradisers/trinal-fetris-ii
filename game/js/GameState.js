/* eslint-disable no-labels, complexity */

var Tetri = require('./Object/Tetri.js')
const Player = require('./Object/Player.js');

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.BLOCK_SCALE = 32
    this.types = 'ILJOTSZ'
    this.blocks = new Tetri()
    this.player = new Player(this.blocks.getBlock(this.randomType()));
    console.log(this.player);
  }

  collide() {
    console.log('in collide', this.player);
    const [m, o] = [this.player.matrix, this.player.pos]
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (this.arena[y + o.y] &&
            this.arena[y + o.y][x + o.x]) !== 0) {
            return true
          }
      }
    }
    return false
  }

  create() {
    // values needed to handle updates
    this.currTime = 0
    this.moveTime = 0
    this.canMove = true
    this.boardState = this.add.group()
    this.arena = this.createMatrix(10, 22)
    this.tetrisBlock = this.add.group()

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

  arenaSweep() {
    outer: for (let y = this.arena.length - 1; y > 0; --y) {
      for (let x = 0; x < this.arena[y].length; ++x) {
        if (this.arena[y][x] === 0){
          continue outer;
        }
      }
      const row = this.arena.splice(y, 1)[0].fill(0)
      this.arena.unshift(row)
      ++y
    }
  }

  createMatrix(w, h) {
    this.newMatrix = []
    while (h--) {
      this.newMatrix.push(new Array(w).fill(0))
    }
    return this.newMatrix
  }

  draw() {
    this.tetrisBlock.killAll()
    this.boardState.killAll()
    this.drawBlock(this.player.matrix, this.player.pos)
    this.drawBoard(this.arena)
  }
  // currentBlock - DRAWS BLOCK
  drawBlock(block, offset = {x: 0, y: 0}) {
    block.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.tetrisBlock.create(
            this.BLOCK_SCALE * (x + offset.x),
            this.BLOCK_SCALE * (y + offset.y),
            'blocks', value)
        }
      })
    })
  }
  // boardState - DRAWS BOARD
  drawBoard(blackMatrix) {
    blackMatrix.forEach((row, y) => {
      row.forEach((value, x) => {
          this.boardState.create(
            this.BLOCK_SCALE * x,
            this.BLOCK_SCALE * y,
            'blocks', value)
      })
    })
  }

  merge() {
    this.player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.arena[y + this.player.pos.y][x + this.player.pos.x] = value
        }
      })
    })
  }

  move(dir) {
    console.log('in move', this)
    this.player.pos.x += dir
    if (this.collide()) {
      this.player.pos.x -= dir
    }
  }

  // currentBlock - allows us to move blocks
  dropBlock() {
    this.player.pos.y++
    if (this.collide()) {
      this.player.pos.y--
      this.merge()
      this.playerReset()
      this.arenaSweep()
    }
  }

  // moveBlock(dir) {
  //   this.player.pos.x += dir
  //   if (this.collide()) {
  //     this.player.pos.x -= dir
  //   }
  // }

  randomType () {
    return this.types[Math.floor(this.types.length * Math.random())]
  }

  rotate(turn = true) {
    const matrix = this.player.matrix
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

  playerReset() {
    const type = this.randomType()
    this.player.matrix = this.blocks.getBlock(type)
    this.player.pos = {x: 3, y: 0}
    if (this.collide()) {
      let gameOver = this.add.text(
        this.world.centerX,
        this.world.centerY,
        'Game Over',
        {fill: 'red', fontSize: 72}
      )
      gameOver.anchor.set(0.5)

      this.input.onTap.addOnce((pointer) => {
        this.world.removeAll()
        this.state.start('MainMenu')
      })
    }
  }

  playerRotate() {
    this.rotate()
    let offset = 1
    while (this.collide()) {
      this.player.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > this.player.matrix[0].length) {
        this.rotate(false)
        return;
      }
    }
  }

  update() {
    this.updateClock()
    this.draw()

    // allows for left and right movement of current piece
    if (this.keys.leftKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.move(-1)
      }
    } else if (this.keys.rightKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.move(1)
      }
    } else if (this.keys.downKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.dropBlock()
      }
    } else if (this.keys.upKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.playerRotate()
      }
    }

  }

  // clock - UPDATES AND MOVES PIECE BASED ON VARIOUS RATES
  updateClock(rate = 1) {
    // fall time
    this.currTime += this.time.elapsed * rate
    if (this.currTime > 1000){
      this.currTime = 0
      this.dropBlock()
    }
    // movement time
    this.moveTime += this.time.elapsed
    if (this.moveTime > 200){
      this.canMove = true
      this.moveTime = 0
    }
  }

  render() {}
}

module.exports = GameState;
