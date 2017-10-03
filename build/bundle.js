(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

class BootState {

  preload() {
    this.load.image('preload', 'img/preload.png')
  }

  create() {
    this.input.maxPointers = 1
    this.state.start('Preload')
  }

  update() { }
  render() { }
}

module.exports = BootState

},{}],2:[function(require,module,exports){
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
  }

  collide() {
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

  moveBlock(dir) {
    this.player.pos.x += dir
    if (this.collide()) {
      this.player.pos.x -= dir
    }
  }

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
        this.moveBlock(-1)
      }
    } else if (this.keys.rightKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(1)
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

module.exports = GameState

},{"./Object/Player.js":4,"./Object/Tetri.js":5}],3:[function(require,module,exports){

class MenuState {

  preload() { }

  create() {
    let logo = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Trinal Fetris II',
      {fill: 'white', fontSize: 72}
    )

    logo.anchor.set(0.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState

},{}],4:[function(require,module,exports){
class Player {
  constructor (matrix) {
    this.pos = {x: 3, y: 0};
    this.matrix = matrix;
  }
}

module.exports = Player;

},{}],5:[function(require,module,exports){
class Tetri {
  constructor(type) {
    this.blocks = {
      T: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      L: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      J: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      S: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      Z: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
    }
  }

  getBlock (type) {
    return this.blocks[type]
  }

}


module.exports = Tetri

},{}],6:[function(require,module,exports){

class PreloadState {

  preload() {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'preload')
    
    this.preloadBar.anchor.set(.5)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('logo', 'img/logo.png')
    this.load.image('pnlogo', 'img/pnlogo.png')
  }

  create() {
    this.state.start('MainMenu')
  }

  update() { }
  render() { }
}

module.exports = PreloadState

},{}],7:[function(require,module,exports){
// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const menuState     = require('./MenuState')
  const gameState     = require('./GameState')

  const game = new Phaser.Game(600, 720, Phaser.AUTO, 'game')

  game.stage.backgroundColor = 0x242432

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

  // game.scale.setMinMax(800, 600)

  game.scale.pageAlignVertically = true
  game.scale.pageAlignHorizontally = true

  game.state.add('Boot',      bootState)
  game.state.add('Preload',   preloadState)
  game.state.add('MainMenu',  menuState)
  game.state.add('Game',      gameState)

  game.state.start('Boot')
})

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvT2JqZWN0L1BsYXllci5qcyIsImJ1aWxkL2pzL09iamVjdC9UZXRyaS5qcyIsImJ1aWxkL2pzL1ByZWxvYWRTdGF0ZS5qcyIsImJ1aWxkL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBCb290U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkJywgJ2ltZy9wcmVsb2FkLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290U3RhdGVcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWxhYmVscywgY29tcGxleGl0eSAqL1xuXG52YXIgVGV0cmkgPSByZXF1aXJlKCcuL09iamVjdC9UZXRyaS5qcycpXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL09iamVjdC9QbGF5ZXIuanMnKTtcblxuY2xhc3MgR2FtZVN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnYmxvY2tzJywgJ2ltZy9ibG9ja3MucG5nJywgMzIsIDMyLCA3KVxuICAgIHRoaXMuQkxPQ0tfU0NBTEUgPSAzMlxuICAgIHRoaXMudHlwZXMgPSAnSUxKT1RTWidcbiAgICB0aGlzLmJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuYmxvY2tzLmdldEJsb2NrKHRoaXMucmFuZG9tVHlwZSgpKSk7XG4gIH1cblxuICBjb2xsaWRlKCkge1xuICAgIGNvbnN0IFttLCBvXSA9IFt0aGlzLnBsYXllci5tYXRyaXgsIHRoaXMucGxheWVyLnBvc11cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IG0ubGVuZ3RoOyArK3kpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbVt5XS5sZW5ndGg7ICsreCkge1xuICAgICAgICBpZiAobVt5XVt4XSAhPT0gMCAmJlxuICAgICAgICAgICh0aGlzLmFyZW5hW3kgKyBvLnldICYmXG4gICAgICAgICAgICB0aGlzLmFyZW5hW3kgKyBvLnldW3ggKyBvLnhdKSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIC8vIHZhbHVlcyBuZWVkZWQgdG8gaGFuZGxlIHVwZGF0ZXNcbiAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgdGhpcy5jYW5Nb3ZlID0gdHJ1ZVxuICAgIHRoaXMuYm9hcmRTdGF0ZSA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICB0aGlzLmFyZW5hID0gdGhpcy5jcmVhdGVNYXRyaXgoMTAsIDIyKVxuICAgIHRoaXMudGV0cmlzQmxvY2sgPSB0aGlzLmFkZC5ncm91cCgpXG5cbiAgICAvLyBrZXlib2FyZCBsaXN0ZW5lcnNcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICB1cEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuVVApLFxuICAgICAgZG93bktleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRE9XTiksXG4gICAgICBsZWZ0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5MRUZUKSxcbiAgICAgIHJpZ2h0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5SSUdIVCksXG4gICAgICBxS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5RKSxcbiAgICAgIGVLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkUpLFxuICAgIH1cblxuICB9XG5cbiAgYXJlbmFTd2VlcCgpIHtcbiAgICBvdXRlcjogZm9yIChsZXQgeSA9IHRoaXMuYXJlbmEubGVuZ3RoIC0gMTsgeSA+IDA7IC0teSkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmFyZW5hW3ldLmxlbmd0aDsgKyt4KSB7XG4gICAgICAgIGlmICh0aGlzLmFyZW5hW3ldW3hdID09PSAwKXtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgcm93ID0gdGhpcy5hcmVuYS5zcGxpY2UoeSwgMSlbMF0uZmlsbCgwKVxuICAgICAgdGhpcy5hcmVuYS51bnNoaWZ0KHJvdylcbiAgICAgICsreVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU1hdHJpeCh3LCBoKSB7XG4gICAgdGhpcy5uZXdNYXRyaXggPSBbXVxuICAgIHdoaWxlIChoLS0pIHtcbiAgICAgIHRoaXMubmV3TWF0cml4LnB1c2gobmV3IEFycmF5KHcpLmZpbGwoMCkpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld01hdHJpeFxuICB9XG5cbiAgZHJhdygpIHtcbiAgICB0aGlzLnRldHJpc0Jsb2NrLmtpbGxBbGwoKVxuICAgIHRoaXMuYm9hcmRTdGF0ZS5raWxsQWxsKClcbiAgICB0aGlzLmRyYXdCbG9jayh0aGlzLnBsYXllci5tYXRyaXgsIHRoaXMucGxheWVyLnBvcylcbiAgICB0aGlzLmRyYXdCb2FyZCh0aGlzLmFyZW5hKVxuICB9XG4gIC8vIGN1cnJlbnRCbG9jayAtIERSQVdTIEJMT0NLXG4gIGRyYXdCbG9jayhibG9jaywgb2Zmc2V0ID0ge3g6IDAsIHk6IDB9KSB7XG4gICAgYmxvY2suZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgdGhpcy50ZXRyaXNCbG9jay5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLkJMT0NLX1NDQUxFICogKHggKyBvZmZzZXQueCksXG4gICAgICAgICAgICB0aGlzLkJMT0NLX1NDQUxFICogKHkgKyBvZmZzZXQueSksXG4gICAgICAgICAgICAnYmxvY2tzJywgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICAvLyBib2FyZFN0YXRlIC0gRFJBV1MgQk9BUkRcbiAgZHJhd0JvYXJkKGJsYWNrTWF0cml4KSB7XG4gICAgYmxhY2tNYXRyaXguZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcbiAgICAgICAgICB0aGlzLmJvYXJkU3RhdGUuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqIHgsXG4gICAgICAgICAgICB0aGlzLkJMT0NLX1NDQUxFICogeSxcbiAgICAgICAgICAgICdibG9ja3MnLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIG1lcmdlKCkge1xuICAgIHRoaXMucGxheWVyLm1hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmFyZW5hW3kgKyB0aGlzLnBsYXllci5wb3MueV1beCArIHRoaXMucGxheWVyLnBvcy54XSA9IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGN1cnJlbnRCbG9jayAtIGFsbG93cyB1cyB0byBtb3ZlIGJsb2Nrc1xuICBkcm9wQmxvY2soKSB7XG4gICAgdGhpcy5wbGF5ZXIucG9zLnkrK1xuICAgIGlmICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnktLVxuICAgICAgdGhpcy5tZXJnZSgpXG4gICAgICB0aGlzLnBsYXllclJlc2V0KClcbiAgICAgIHRoaXMuYXJlbmFTd2VlcCgpXG4gICAgfVxuICB9XG5cbiAgbW92ZUJsb2NrKGRpcikge1xuICAgIHRoaXMucGxheWVyLnBvcy54ICs9IGRpclxuICAgIGlmICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnggLT0gZGlyXG4gICAgfVxuICB9XG5cbiAgcmFuZG9tVHlwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZXNbTWF0aC5mbG9vcih0aGlzLnR5cGVzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXVxuICB9XG5cbiAgcm90YXRlKHR1cm4gPSB0cnVlKSB7XG4gICAgY29uc3QgbWF0cml4ID0gdGhpcy5wbGF5ZXIubWF0cml4XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtYXRyaXgubGVuZ3RoOyArK3kpIHtcbiAgICAgIGZvciAoIGxldCB4ID0gMDsgeCA8IHk7ICsreCkge1xuICAgICAgICBbXG4gICAgICAgICAgbWF0cml4W3hdW3ldLFxuICAgICAgICAgIG1hdHJpeFt5XVt4XSxcbiAgICAgICAgXSA9IFtcbiAgICAgICAgICBtYXRyaXhbeV1beF0sXG4gICAgICAgICAgbWF0cml4W3hdW3ldLFxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0dXJuKSB7XG4gICAgICBtYXRyaXguZm9yRWFjaChyb3cgPT4gcm93LnJldmVyc2UoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0cml4LnJldmVyc2UoKVxuICAgIH1cbiAgfVxuXG4gIHBsYXllclJlc2V0KCkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnJhbmRvbVR5cGUoKVxuICAgIHRoaXMucGxheWVyLm1hdHJpeCA9IHRoaXMuYmxvY2tzLmdldEJsb2NrKHR5cGUpXG4gICAgdGhpcy5wbGF5ZXIucG9zID0ge3g6IDMsIHk6IDB9XG4gICAgaWYgKHRoaXMuY29sbGlkZSgpKSB7XG4gICAgICBsZXQgZ2FtZU92ZXIgPSB0aGlzLmFkZC50ZXh0KFxuICAgICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICAgIHRoaXMud29ybGQuY2VudGVyWSxcbiAgICAgICAgJ0dhbWUgT3ZlcicsXG4gICAgICAgIHtmaWxsOiAncmVkJywgZm9udFNpemU6IDcyfVxuICAgICAgKVxuICAgICAgZ2FtZU92ZXIuYW5jaG9yLnNldCgwLjUpXG5cbiAgICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xuICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUFsbCgpXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcGxheWVyUm90YXRlKCkge1xuICAgIHRoaXMucm90YXRlKClcbiAgICBsZXQgb2Zmc2V0ID0gMVxuICAgIHdoaWxlICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnggKz0gb2Zmc2V0XG4gICAgICBvZmZzZXQgPSAtKG9mZnNldCArIChvZmZzZXQgPiAwID8gMSA6IC0xKSlcbiAgICAgIGlmIChvZmZzZXQgPiB0aGlzLnBsYXllci5tYXRyaXhbMF0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucm90YXRlKGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ2xvY2soKVxuICAgIHRoaXMuZHJhdygpXG5cbiAgICAvLyBhbGxvd3MgZm9yIGxlZnQgYW5kIHJpZ2h0IG1vdmVtZW50IG9mIGN1cnJlbnQgcGllY2VcbiAgICBpZiAodGhpcy5rZXlzLmxlZnRLZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKC0xKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLnJpZ2h0S2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygxKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLmRvd25LZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMuZHJvcEJsb2NrKClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy51cEtleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5wbGF5ZXJSb3RhdGUoKVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLy8gY2xvY2sgLSBVUERBVEVTIEFORCBNT1ZFUyBQSUVDRSBCQVNFRCBPTiBWQVJJT1VTIFJBVEVTXG4gIHVwZGF0ZUNsb2NrKHJhdGUgPSAxKSB7XG4gICAgLy8gZmFsbCB0aW1lXG4gICAgdGhpcy5jdXJyVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZCAqIHJhdGVcbiAgICBpZiAodGhpcy5jdXJyVGltZSA+IDEwMDApe1xuICAgICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICAgIHRoaXMuZHJvcEJsb2NrKClcbiAgICB9XG4gICAgLy8gbW92ZW1lbnQgdGltZVxuICAgIHRoaXMubW92ZVRpbWUgKz0gdGhpcy50aW1lLmVsYXBzZWRcbiAgICBpZiAodGhpcy5tb3ZlVGltZSA+IDIwMCl7XG4gICAgICB0aGlzLmNhbk1vdmUgPSB0cnVlXG4gICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScsXG4gICAgICB7ZmlsbDogJ3doaXRlJywgZm9udFNpemU6IDcyfVxuICAgIClcblxuICAgIGxvZ28uYW5jaG9yLnNldCgwLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvciAobWF0cml4KSB7XG4gICAgdGhpcy5wb3MgPSB7eDogMywgeTogMH07XG4gICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJjbGFzcyBUZXRyaSB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICB0aGlzLmJsb2NrcyA9IHtcbiAgICAgIFQ6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMSwgMSwgMV0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBJOiBbXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgIF0sXG4gICAgICBMOiBbXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMV0sXG4gICAgICBdLFxuICAgICAgSjogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIFM6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMV0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBaOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMV0sXG4gICAgICBdLFxuICAgICAgTzogW1xuICAgICAgICBbMSwgMV0sXG4gICAgICAgIFsxLCAxXSxcbiAgICAgIF0sXG4gICAgfVxuICB9XG5cbiAgZ2V0QmxvY2sgKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5ibG9ja3NbdHlwZV1cbiAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXRyaVxuIiwiXG5jbGFzcyBQcmVsb2FkU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5wcmVsb2FkQmFyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsIFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLCBcbiAgICAgICdwcmVsb2FkJylcbiAgICBcbiAgICB0aGlzLnByZWxvYWRCYXIuYW5jaG9yLnNldCguNSlcblxuICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZEJhcilcblxuICAgIHRoaXMubG9hZC5pbWFnZSgnbG9nbycsICdpbWcvbG9nby5wbmcnKVxuICAgIHRoaXMubG9hZC5pbWFnZSgncG5sb2dvJywgJ2ltZy9wbmxvZ28ucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdNYWluTWVudScpXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZFN0YXRlXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNjAwLCA3MjAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG5cbiAgZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweDI0MjQzMlxuXG4gIGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICBnYW1lLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cbiAgLy8gZ2FtZS5zY2FsZS5zZXRNaW5NYXgoODAwLCA2MDApXG5cbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcblxuICBnYW1lLnN0YXRlLmFkZCgnQm9vdCcsICAgICAgYm9vdFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsICAgcHJlbG9hZFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnTWFpbk1lbnUnLCAgbWVudVN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnR2FtZScsICAgICAgZ2FtZVN0YXRlKVxuXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0Jvb3QnKVxufSlcbiJdfQ==
