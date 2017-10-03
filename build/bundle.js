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
const {collide} = require('../GameState');

class Player {

  constructor (matrix) {
    this.pos = {x: 3, y: 0};
    this.matrix = matrix;
  }


}

module.exports = Player;

},{"../GameState":2}],5:[function(require,module,exports){
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
  const GameState     = require('./GameState')

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
  game.state.add('Game',      GameState)

  game.state.start('Boot')
})

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvT2JqZWN0L1BsYXllci5qcyIsImJ1aWxkL2pzL09iamVjdC9UZXRyaS5qcyIsImJ1aWxkL2pzL1ByZWxvYWRTdGF0ZS5qcyIsImJ1aWxkL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBCb290U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkJywgJ2ltZy9wcmVsb2FkLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290U3RhdGVcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWxhYmVscywgY29tcGxleGl0eSAqL1xuXG52YXIgVGV0cmkgPSByZXF1aXJlKCcuL09iamVjdC9UZXRyaS5qcycpXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL09iamVjdC9QbGF5ZXIuanMnKTtcblxuY2xhc3MgR2FtZVN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnYmxvY2tzJywgJ2ltZy9ibG9ja3MucG5nJywgMzIsIDMyLCA3KVxuICAgIHRoaXMuQkxPQ0tfU0NBTEUgPSAzMlxuICAgIHRoaXMudHlwZXMgPSAnSUxKT1RTWidcbiAgICB0aGlzLmJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuYmxvY2tzLmdldEJsb2NrKHRoaXMucmFuZG9tVHlwZSgpKSk7XG4gICAgY29uc29sZS5sb2codGhpcy5wbGF5ZXIpO1xuICB9XG5cbiAgY29sbGlkZSgpIHtcbiAgICBjb25zb2xlLmxvZygnaW4gY29sbGlkZScsIHRoaXMucGxheWVyKTtcbiAgICBjb25zdCBbbSwgb10gPSBbdGhpcy5wbGF5ZXIubWF0cml4LCB0aGlzLnBsYXllci5wb3NdXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtLmxlbmd0aDsgKyt5KSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG1beV0ubGVuZ3RoOyArK3gpIHtcbiAgICAgICAgaWYgKG1beV1beF0gIT09IDAgJiZcbiAgICAgICAgICAodGhpcy5hcmVuYVt5ICsgby55XSAmJlxuICAgICAgICAgICAgdGhpcy5hcmVuYVt5ICsgby55XVt4ICsgby54XSkgIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICAvLyB2YWx1ZXMgbmVlZGVkIHRvIGhhbmRsZSB1cGRhdGVzXG4gICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcbiAgICB0aGlzLmJvYXJkU3RhdGUgPSB0aGlzLmFkZC5ncm91cCgpXG4gICAgdGhpcy5hcmVuYSA9IHRoaXMuY3JlYXRlTWF0cml4KDEwLCAyMilcbiAgICB0aGlzLnRldHJpc0Jsb2NrID0gdGhpcy5hZGQuZ3JvdXAoKVxuXG4gICAgLy8ga2V5Ym9hcmQgbGlzdGVuZXJzXG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgdXBLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlVQKSxcbiAgICAgIGRvd25LZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkRPV04pLFxuICAgICAgbGVmdEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuTEVGVCksXG4gICAgICByaWdodEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuUklHSFQpLFxuICAgICAgcUtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuUSksXG4gICAgICBlS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5FKSxcbiAgICB9XG5cbiAgfVxuXG4gIGFyZW5hU3dlZXAoKSB7XG4gICAgb3V0ZXI6IGZvciAobGV0IHkgPSB0aGlzLmFyZW5hLmxlbmd0aCAtIDE7IHkgPiAwOyAtLXkpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5hcmVuYVt5XS5sZW5ndGg7ICsreCkge1xuICAgICAgICBpZiAodGhpcy5hcmVuYVt5XVt4XSA9PT0gMCl7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMuYXJlbmEuc3BsaWNlKHksIDEpWzBdLmZpbGwoMClcbiAgICAgIHRoaXMuYXJlbmEudW5zaGlmdChyb3cpXG4gICAgICArK3lcbiAgICB9XG4gIH1cblxuICBjcmVhdGVNYXRyaXgodywgaCkge1xuICAgIHRoaXMubmV3TWF0cml4ID0gW11cbiAgICB3aGlsZSAoaC0tKSB7XG4gICAgICB0aGlzLm5ld01hdHJpeC5wdXNoKG5ldyBBcnJheSh3KS5maWxsKDApKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdNYXRyaXhcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgdGhpcy50ZXRyaXNCbG9jay5raWxsQWxsKClcbiAgICB0aGlzLmJvYXJkU3RhdGUua2lsbEFsbCgpXG4gICAgdGhpcy5kcmF3QmxvY2sodGhpcy5wbGF5ZXIubWF0cml4LCB0aGlzLnBsYXllci5wb3MpXG4gICAgdGhpcy5kcmF3Qm9hcmQodGhpcy5hcmVuYSlcbiAgfVxuICAvLyBjdXJyZW50QmxvY2sgLSBEUkFXUyBCTE9DS1xuICBkcmF3QmxvY2soYmxvY2ssIG9mZnNldCA9IHt4OiAwLCB5OiAwfSkge1xuICAgIGJsb2NrLmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMudGV0cmlzQmxvY2suY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqICh4ICsgb2Zmc2V0LngpLFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqICh5ICsgb2Zmc2V0LnkpLFxuICAgICAgICAgICAgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy8gYm9hcmRTdGF0ZSAtIERSQVdTIEJPQVJEXG4gIGRyYXdCb2FyZChibGFja01hdHJpeCkge1xuICAgIGJsYWNrTWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgICAgdGhpcy5ib2FyZFN0YXRlLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiB4LFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqIHksXG4gICAgICAgICAgICAnYmxvY2tzJywgdmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBtZXJnZSgpIHtcbiAgICB0aGlzLnBsYXllci5tYXRyaXguZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgdGhpcy5hcmVuYVt5ICsgdGhpcy5wbGF5ZXIucG9zLnldW3ggKyB0aGlzLnBsYXllci5wb3MueF0gPSB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBtb3ZlKGRpcikge1xuICAgIGNvbnNvbGUubG9nKCdpbiBtb3ZlJywgdGhpcylcbiAgICB0aGlzLnBsYXllci5wb3MueCArPSBkaXJcbiAgICBpZiAodGhpcy5jb2xsaWRlKCkpIHtcbiAgICAgIHRoaXMucGxheWVyLnBvcy54IC09IGRpclxuICAgIH1cbiAgfVxuXG4gIC8vIGN1cnJlbnRCbG9jayAtIGFsbG93cyB1cyB0byBtb3ZlIGJsb2Nrc1xuICBkcm9wQmxvY2soKSB7XG4gICAgdGhpcy5wbGF5ZXIucG9zLnkrK1xuICAgIGlmICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnktLVxuICAgICAgdGhpcy5tZXJnZSgpXG4gICAgICB0aGlzLnBsYXllclJlc2V0KClcbiAgICAgIHRoaXMuYXJlbmFTd2VlcCgpXG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZUJsb2NrKGRpcikge1xuICAvLyAgIHRoaXMucGxheWVyLnBvcy54ICs9IGRpclxuICAvLyAgIGlmICh0aGlzLmNvbGxpZGUoKSkge1xuICAvLyAgICAgdGhpcy5wbGF5ZXIucG9zLnggLT0gZGlyXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgcmFuZG9tVHlwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZXNbTWF0aC5mbG9vcih0aGlzLnR5cGVzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXVxuICB9XG5cbiAgcm90YXRlKHR1cm4gPSB0cnVlKSB7XG4gICAgY29uc3QgbWF0cml4ID0gdGhpcy5wbGF5ZXIubWF0cml4XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtYXRyaXgubGVuZ3RoOyArK3kpIHtcbiAgICAgIGZvciAoIGxldCB4ID0gMDsgeCA8IHk7ICsreCkge1xuICAgICAgICBbXG4gICAgICAgICAgbWF0cml4W3hdW3ldLFxuICAgICAgICAgIG1hdHJpeFt5XVt4XSxcbiAgICAgICAgXSA9IFtcbiAgICAgICAgICBtYXRyaXhbeV1beF0sXG4gICAgICAgICAgbWF0cml4W3hdW3ldLFxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0dXJuKSB7XG4gICAgICBtYXRyaXguZm9yRWFjaChyb3cgPT4gcm93LnJldmVyc2UoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0cml4LnJldmVyc2UoKVxuICAgIH1cbiAgfVxuXG4gIHBsYXllclJlc2V0KCkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnJhbmRvbVR5cGUoKVxuICAgIHRoaXMucGxheWVyLm1hdHJpeCA9IHRoaXMuYmxvY2tzLmdldEJsb2NrKHR5cGUpXG4gICAgdGhpcy5wbGF5ZXIucG9zID0ge3g6IDMsIHk6IDB9XG4gICAgaWYgKHRoaXMuY29sbGlkZSgpKSB7XG4gICAgICBsZXQgZ2FtZU92ZXIgPSB0aGlzLmFkZC50ZXh0KFxuICAgICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICAgIHRoaXMud29ybGQuY2VudGVyWSxcbiAgICAgICAgJ0dhbWUgT3ZlcicsXG4gICAgICAgIHtmaWxsOiAncmVkJywgZm9udFNpemU6IDcyfVxuICAgICAgKVxuICAgICAgZ2FtZU92ZXIuYW5jaG9yLnNldCgwLjUpXG5cbiAgICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xuICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUFsbCgpXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcGxheWVyUm90YXRlKCkge1xuICAgIHRoaXMucm90YXRlKClcbiAgICBsZXQgb2Zmc2V0ID0gMVxuICAgIHdoaWxlICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnggKz0gb2Zmc2V0XG4gICAgICBvZmZzZXQgPSAtKG9mZnNldCArIChvZmZzZXQgPiAwID8gMSA6IC0xKSlcbiAgICAgIGlmIChvZmZzZXQgPiB0aGlzLnBsYXllci5tYXRyaXhbMF0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucm90YXRlKGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ2xvY2soKVxuICAgIHRoaXMuZHJhdygpXG5cbiAgICAvLyBhbGxvd3MgZm9yIGxlZnQgYW5kIHJpZ2h0IG1vdmVtZW50IG9mIGN1cnJlbnQgcGllY2VcbiAgICBpZiAodGhpcy5rZXlzLmxlZnRLZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZSgtMSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy5yaWdodEtleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5tb3ZlKDEpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmtleXMuZG93bktleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5kcm9wQmxvY2soKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLnVwS2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLnBsYXllclJvdGF0ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyBjbG9jayAtIFVQREFURVMgQU5EIE1PVkVTIFBJRUNFIEJBU0VEIE9OIFZBUklPVVMgUkFURVNcbiAgdXBkYXRlQ2xvY2socmF0ZSA9IDEpIHtcbiAgICAvLyBmYWxsIHRpbWVcbiAgICB0aGlzLmN1cnJUaW1lICs9IHRoaXMudGltZS5lbGFwc2VkICogcmF0ZVxuICAgIGlmICh0aGlzLmN1cnJUaW1lID4gMTAwMCl7XG4gICAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgICAgdGhpcy5kcm9wQmxvY2soKVxuICAgIH1cbiAgICAvLyBtb3ZlbWVudCB0aW1lXG4gICAgdGhpcy5tb3ZlVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZFxuICAgIGlmICh0aGlzLm1vdmVUaW1lID4gMjAwKXtcbiAgICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcbiAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdGU7XG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScsXG4gICAgICB7ZmlsbDogJ3doaXRlJywgZm9udFNpemU6IDcyfVxuICAgIClcblxuICAgIGxvZ28uYW5jaG9yLnNldCgwLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJjb25zdCB7Y29sbGlkZX0gPSByZXF1aXJlKCcuLi9HYW1lU3RhdGUnKTtcblxuY2xhc3MgUGxheWVyIHtcblxuICBjb25zdHJ1Y3RvciAobWF0cml4KSB7XG4gICAgdGhpcy5wb3MgPSB7eDogMywgeTogMH07XG4gICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XG4gIH1cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwiY2xhc3MgVGV0cmkge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgdGhpcy5ibG9ja3MgPSB7XG4gICAgICBUOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgSTogW1xuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICBdLFxuICAgICAgTDogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIEo6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBTOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgWjogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIE86IFtcbiAgICAgICAgWzEsIDFdLFxuICAgICAgICBbMSwgMV0sXG4gICAgICBdLFxuICAgIH1cbiAgfVxuXG4gIGdldEJsb2NrICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW3R5cGVdXG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV0cmlcbiIsIlxuY2xhc3MgUHJlbG9hZFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMucHJlbG9hZEJhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAncHJlbG9hZCcpXG4gICAgXG4gICAgdGhpcy5wcmVsb2FkQmFyLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLnByZWxvYWRCYXIpXG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xvZ28nLCAnaW1nL2xvZ28ucG5nJylcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BubG9nbycsICdpbWcvcG5sb2dvLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWFpbk1lbnUnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRTdGF0ZVxuIiwiLy8gUEhBU0VSIElTIElNUE9SVEVEIEFTIEFOIEVYVEVSTkFMIEJVTkRMRSBJTiBJTkRFWC5IVE1MXG5cblBoYXNlci5EZXZpY2Uud2hlblJlYWR5KCgpID0+IHtcbiAgY29uc3QgYm9vdFN0YXRlICAgICA9IHJlcXVpcmUoJy4vQm9vdFN0YXRlJylcbiAgY29uc3QgcHJlbG9hZFN0YXRlICA9IHJlcXVpcmUoJy4vUHJlbG9hZFN0YXRlJylcbiAgY29uc3QgbWVudVN0YXRlICAgICA9IHJlcXVpcmUoJy4vTWVudVN0YXRlJylcbiAgY29uc3QgR2FtZVN0YXRlICAgICA9IHJlcXVpcmUoJy4vR2FtZVN0YXRlJylcblxuICBjb25zdCBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDYwMCwgNzIwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxuXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHgyNDI0MzJcblxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXG4gIC8vIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKVxuXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG5cbiAgZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCAgICAgIGJvb3RTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCAgIHByZWxvYWRTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01haW5NZW51JywgIG1lbnVTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCAgICAgIEdhbWVTdGF0ZSlcblxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jylcbn0pXG4iXX0=
