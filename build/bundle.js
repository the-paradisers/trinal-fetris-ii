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

},{"./Tetri.js":5}],3:[function(require,module,exports){

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
// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const menuState     = require('./MenuState')
  const gameState     = require('./GameState')

  const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game')

  game.stage.backgroundColor = 0x242432

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

  game.scale.setMinMax(800, 600)

  game.scale.pageAlignVertically = true
  game.scale.pageAlignHorizontally = true

  game.state.add('Boot',      bootState)
  game.state.add('Preload',   preloadState)
  game.state.add('MainMenu',  menuState)
  game.state.add('Game',      gameState)

  game.state.start('Boot')
})

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNsYXNzIEJvb3RTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWQnLCAnaW1nL3ByZWxvYWQucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMVxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RTdGF0ZVxuIiwidmFyIFRldHJpID0gcmVxdWlyZSgnLi9UZXRyaS5qcycpXG5cbmNsYXNzIEdhbWVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Jsb2NrcycsICdpbWcvYmxvY2tzLnBuZycsIDMyLCAzMiwgNylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICAvLyB2YWx1ZXMgbmVlZGVkIHRvIGhhbmRsZSB1cGRhdGVzXG4gICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcblxuICAgIC8vIGtleWJvYXJkIGxpc3RlbmVyc1xuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIHVwS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5VUCksXG4gICAgICBkb3duS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5ET1dOKSxcbiAgICAgIGxlZnRLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkxFRlQpLFxuICAgICAgcmlnaHRLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlJJR0hUKSxcbiAgICAgIHFLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlEpLFxuICAgICAgZUtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRSksXG4gICAgfVxuICAgIHRoaXMua2V5cy5xS2V5Lm9uRG93bi5hZGQoKCkgPT4gdGhpcy5yb3RhdGUoLTEpKVxuICAgIHRoaXMua2V5cy5lS2V5Lm9uRG93bi5hZGQoKCkgPT4gdGhpcy5yb3RhdGUoMSkpXG5cbiAgICAvLyBib2FyZCAtIENSRUFURVxuICAgIHRoaXMuYm9hcmRTdGF0ZSA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICBjb25zdCBib2FyZCA9IHRoaXMuZHJhd0JvYXJkKFtcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICBdKVxuXG4gICAgLy8gY3VycmVudEJsb2NrIC0gQ1JFQVRFXG4gICAgY29uc3QgdHlwZXMgPSAnSUxKT1RTWidcbiAgICBmdW5jdGlvbiByYW5kb21UeXBlICgpIHtcbiAgICAgIHJldHVybiB0eXBlc1tNYXRoLmZsb29yKHR5cGVzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXVxuICAgIH1cblxuICAgIGNvbnN0IEJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgdGhpcy50ZXRyaXNCbG9jayA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICBjb25zdCB0eXBlID0gcmFuZG9tVHlwZSgpXG4gICAgdGhpcy5kcmF3QmxvY2soQmxvY2tzLmdldEJsb2NrKHR5cGUpKVxuICAgIGlmICh0eXBlID09PSAnTycpIHtcbiAgICAgIHRoaXMudGV0cmlzQmxvY2sucGl2b3QueCA9IDMyXG4gICAgICB0aGlzLnRldHJpc0Jsb2NrLnBpdm90LnkgPSAzMlxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ0knKSB7XG4gICAgICB0aGlzLnRldHJpc0Jsb2NrLnBpdm90LnggPSA2NFxuICAgICAgdGhpcy50ZXRyaXNCbG9jay5waXZvdC55ID0gNjRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZXRyaXNCbG9jay5waXZvdC54ID0gNDhcbiAgICAgIHRoaXMudGV0cmlzQmxvY2sucGl2b3QueSA9IDQ4XG4gICAgfVxuICB9XG5cbiAgLy8gY3VycmVudEJsb2NrIC0gRFJBV1MgQkxPQ0tcbiAgZHJhd0Jsb2NrKGJsb2NrKSB7XG4gICAgYmxvY2suZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgdGhpcy50ZXRyaXNCbG9jay5jcmVhdGUoMzIgKiAoeCksIDMyICogKHkpLCAnYmxvY2tzJywgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGJvYXJkU3RhdGUgLSBEUkFXUyBCT0FSRFxuICBkcmF3Qm9hcmQoYmxhY2tNYXRyaXgpIHtcbiAgICBibGFja01hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICAgIHRoaXMuYm9hcmRTdGF0ZS5jcmVhdGUoMzIgKiB4LCAzMiAqIHksICdibG9ja3MnLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGNsb2NrIC0gVVBEQVRFUyBBTkQgTU9WRVMgUElFQ0UgQkFTRUQgT04gVkFSSU9VUyBSQVRFU1xuICB1cGRhdGVDbG9jayhyYXRlID0gMSkge1xuICAgIC8vIGZhbGwgdGltZVxuICAgIHRoaXMuY3VyclRpbWUgKz0gdGhpcy50aW1lLmVsYXBzZWQgKiByYXRlXG4gICAgaWYgKHRoaXMuY3VyclRpbWUgPiAxMDAwKXtcbiAgICAgIHRoaXMuY3VyclRpbWUgPSAwXG4gICAgICB0aGlzLm1vdmVCbG9jaygwLCAxKVxuICAgIH1cbiAgICAvLyBtb3ZlbWVudCB0aW1lXG4gICAgdGhpcy5tb3ZlVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZFxuICAgIGlmICh0aGlzLm1vdmVUaW1lID4gMjUwKXtcbiAgICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcbiAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgfVxuICB9XG5cbiAgLy8gY3VycmVudEJsb2NrIC0gYWxsb3dzIHVzIHRvIG1vdmUgYmxvY2tzXG4gIG1vdmVCbG9jayh4LCB5KSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy50ZXRyaXNCbG9jay5wb3NpdGlvbilcblxuICAgIHRoaXMudGV0cmlzQmxvY2sucG9zaXRpb24ueCArPSAoeCAqIDMyKVxuICAgIHRoaXMudGV0cmlzQmxvY2sucG9zaXRpb24ueSArPSAoeSAqIDMyKVxuICB9XG5cbiAgcm90YXRlKGRpcikge1xuICAgIHRoaXMudGV0cmlzQmxvY2suYW5nbGUgKz0gOTAgKiBkaXJcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnRldHJpc0Jsb2NrKVxuICAgIHRoaXMudXBkYXRlQ2xvY2soKVxuXG4gICAgLy8gYWxsb3dzIGZvciBsZWZ0IGFuZCByaWdodCBtb3ZlbWVudCBvZiBjdXJyZW50IHBpZWNlXG4gICAgaWYgKHRoaXMua2V5cy5sZWZ0S2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygtMSwgMClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy5yaWdodEtleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5tb3ZlQmxvY2soMSwgMClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy5kb3duS2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygwLCAxKVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScsXG4gICAgICB7ZmlsbDogJ3doaXRlJywgZm9udFNpemU6IDcyfVxuICAgIClcblxuICAgIGxvZ28uYW5jaG9yLnNldCgwLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJcbmNsYXNzIFByZWxvYWRTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCwgXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksIFxuICAgICAgJ3ByZWxvYWQnKVxuICAgIFxuICAgIHRoaXMucHJlbG9hZEJhci5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkQmFyKVxuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdsb2dvJywgJ2ltZy9sb2dvLnBuZycpXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwbmxvZ28nLCAnaW1nL3BubG9nby5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkU3RhdGVcbiIsImNsYXNzIFRldHJpIHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHRoaXMuYmxvY2tzID0ge1xuICAgICAgVDogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIEk6IFtcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgXSxcbiAgICAgIEw6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBKOiBbXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgUzogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIFo6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBPOiBbXG4gICAgICAgIFsxLCAxXSxcbiAgICAgICAgWzEsIDFdLFxuICAgICAgXSxcbiAgICB9XG4gIH1cblxuICBnZXRCbG9jayAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLmJsb2Nrc1t0eXBlXVxuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRldHJpXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTI4MCwgNzIwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxuXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHgyNDI0MzJcblxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXG4gIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKVxuXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG5cbiAgZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCAgICAgIGJvb3RTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCAgIHByZWxvYWRTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01haW5NZW51JywgIG1lbnVTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCAgICAgIGdhbWVTdGF0ZSlcblxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jylcbn0pXG4iXX0=
