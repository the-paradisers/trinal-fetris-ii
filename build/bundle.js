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
    this.BLOCK_SCALE = 32

    this.blocks = new Tetri()
    this.player = {
      pos: {x: 3, y: 1},
      matrix: this.blocks.getBlock('T')
    }
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

    // currentBlock - CREATE
    const types = 'ILJOTSZ'
    function randomType () {
      return types[Math.floor(types.length * Math.random())]
    }
    this.tetrisBlock = this.add.group()
    const type = randomType()

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
      this.player.pos = {x: 3, y: 0}
    }
  }

  moveBlock(dir) {
    this.player.pos.x += dir
    if (this.collide()) {
      this.player.pos.x -= dir
    }
  }

  // rotate(dir) {
  //   this.tetrisBlock.angle += 90 * dir
  // }

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
    if (this.moveTime > 250){
      this.canMove = true
      this.moveTime = 0
    }
  }

  render() {}
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

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNsYXNzIEJvb3RTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWQnLCAnaW1nL3ByZWxvYWQucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMVxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RTdGF0ZVxuIiwidmFyIFRldHJpID0gcmVxdWlyZSgnLi9UZXRyaS5qcycpXG5cbmNsYXNzIEdhbWVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Jsb2NrcycsICdpbWcvYmxvY2tzLnBuZycsIDMyLCAzMiwgNylcbiAgICB0aGlzLkJMT0NLX1NDQUxFID0gMzJcblxuICAgIHRoaXMuYmxvY2tzID0gbmV3IFRldHJpKClcbiAgICB0aGlzLnBsYXllciA9IHtcbiAgICAgIHBvczoge3g6IDMsIHk6IDF9LFxuICAgICAgbWF0cml4OiB0aGlzLmJsb2Nrcy5nZXRCbG9jaygnVCcpXG4gICAgfVxuICB9XG5cbiAgY29sbGlkZSgpIHtcbiAgICBjb25zdCBbbSwgb10gPSBbdGhpcy5wbGF5ZXIubWF0cml4LCB0aGlzLnBsYXllci5wb3NdXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtLmxlbmd0aDsgKyt5KSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG1beV0ubGVuZ3RoOyArK3gpIHtcbiAgICAgICAgaWYgKG1beV1beF0gIT09IDAgJiZcbiAgICAgICAgICAodGhpcy5hcmVuYVt5ICsgby55XSAmJlxuICAgICAgICAgICAgdGhpcy5hcmVuYVt5ICsgby55XVt4ICsgby54XSkgIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICAvLyB2YWx1ZXMgbmVlZGVkIHRvIGhhbmRsZSB1cGRhdGVzXG4gICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcblxuICAgIHRoaXMuYm9hcmRTdGF0ZSA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICB0aGlzLmFyZW5hID0gdGhpcy5jcmVhdGVNYXRyaXgoMTAsIDIyKVxuXG4gICAgLy8gY3VycmVudEJsb2NrIC0gQ1JFQVRFXG4gICAgY29uc3QgdHlwZXMgPSAnSUxKT1RTWidcbiAgICBmdW5jdGlvbiByYW5kb21UeXBlICgpIHtcbiAgICAgIHJldHVybiB0eXBlc1tNYXRoLmZsb29yKHR5cGVzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkpXVxuICAgIH1cbiAgICB0aGlzLnRldHJpc0Jsb2NrID0gdGhpcy5hZGQuZ3JvdXAoKVxuICAgIGNvbnN0IHR5cGUgPSByYW5kb21UeXBlKClcblxuICAgIC8vIGtleWJvYXJkIGxpc3RlbmVyc1xuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIHVwS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5VUCksXG4gICAgICBkb3duS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5ET1dOKSxcbiAgICAgIGxlZnRLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkxFRlQpLFxuICAgICAgcmlnaHRLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlJJR0hUKSxcbiAgICAgIHFLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlEpLFxuICAgICAgZUtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRSksXG4gICAgfVxuXG4gIH1cblxuICBjcmVhdGVNYXRyaXgodywgaCkge1xuICAgIHRoaXMubmV3TWF0cml4ID0gW11cbiAgICB3aGlsZSAoaC0tKSB7XG4gICAgICB0aGlzLm5ld01hdHJpeC5wdXNoKG5ldyBBcnJheSh3KS5maWxsKDApKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdNYXRyaXhcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgdGhpcy50ZXRyaXNCbG9jay5raWxsQWxsKClcbiAgICB0aGlzLmJvYXJkU3RhdGUua2lsbEFsbCgpXG4gICAgdGhpcy5kcmF3QmxvY2sodGhpcy5wbGF5ZXIubWF0cml4LCB0aGlzLnBsYXllci5wb3MpXG4gICAgdGhpcy5kcmF3Qm9hcmQodGhpcy5hcmVuYSlcbiAgfVxuICAvLyBjdXJyZW50QmxvY2sgLSBEUkFXUyBCTE9DS1xuICBkcmF3QmxvY2soYmxvY2ssIG9mZnNldCA9IHt4OiAwLCB5OiAwfSkge1xuICAgIGJsb2NrLmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMudGV0cmlzQmxvY2suY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqICh4ICsgb2Zmc2V0LngpLFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqICh5ICsgb2Zmc2V0LnkpLFxuICAgICAgICAgICAgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy8gYm9hcmRTdGF0ZSAtIERSQVdTIEJPQVJEXG4gIGRyYXdCb2FyZChibGFja01hdHJpeCkge1xuICAgIGJsYWNrTWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgICAgdGhpcy5ib2FyZFN0YXRlLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiB4LFxuICAgICAgICAgICAgdGhpcy5CTE9DS19TQ0FMRSAqIHksXG4gICAgICAgICAgICAnYmxvY2tzJywgdmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBtZXJnZSgpIHtcbiAgICB0aGlzLnBsYXllci5tYXRyaXguZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgdGhpcy5hcmVuYVt5ICsgdGhpcy5wbGF5ZXIucG9zLnldW3ggKyB0aGlzLnBsYXllci5wb3MueF0gPSB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvLyBjdXJyZW50QmxvY2sgLSBhbGxvd3MgdXMgdG8gbW92ZSBibG9ja3NcbiAgZHJvcEJsb2NrKCkge1xuICAgIHRoaXMucGxheWVyLnBvcy55KytcbiAgICBpZiAodGhpcy5jb2xsaWRlKCkpIHtcbiAgICAgIHRoaXMucGxheWVyLnBvcy55LS1cbiAgICAgIHRoaXMubWVyZ2UoKVxuICAgICAgdGhpcy5wbGF5ZXIucG9zID0ge3g6IDMsIHk6IDB9XG4gICAgfVxuICB9XG5cbiAgbW92ZUJsb2NrKGRpcikge1xuICAgIHRoaXMucGxheWVyLnBvcy54ICs9IGRpclxuICAgIGlmICh0aGlzLmNvbGxpZGUoKSkge1xuICAgICAgdGhpcy5wbGF5ZXIucG9zLnggLT0gZGlyXG4gICAgfVxuICB9XG5cbiAgLy8gcm90YXRlKGRpcikge1xuICAvLyAgIHRoaXMudGV0cmlzQmxvY2suYW5nbGUgKz0gOTAgKiBkaXJcbiAgLy8gfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNsb2NrKClcbiAgICB0aGlzLmRyYXcoKVxuXG4gICAgLy8gYWxsb3dzIGZvciBsZWZ0IGFuZCByaWdodCBtb3ZlbWVudCBvZiBjdXJyZW50IHBpZWNlXG4gICAgaWYgKHRoaXMua2V5cy5sZWZ0S2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygtMSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy5yaWdodEtleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5tb3ZlQmxvY2soMSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMua2V5cy5kb3duS2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLmRyb3BCbG9jaygpXG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyBjbG9jayAtIFVQREFURVMgQU5EIE1PVkVTIFBJRUNFIEJBU0VEIE9OIFZBUklPVVMgUkFURVNcbiAgdXBkYXRlQ2xvY2socmF0ZSA9IDEpIHtcbiAgICAvLyBmYWxsIHRpbWVcbiAgICB0aGlzLmN1cnJUaW1lICs9IHRoaXMudGltZS5lbGFwc2VkICogcmF0ZVxuICAgIGlmICh0aGlzLmN1cnJUaW1lID4gMTAwMCl7XG4gICAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgICAgdGhpcy5kcm9wQmxvY2soKVxuICAgIH1cbiAgICAvLyBtb3ZlbWVudCB0aW1lXG4gICAgdGhpcy5tb3ZlVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZFxuICAgIGlmICh0aGlzLm1vdmVUaW1lID4gMjUwKXtcbiAgICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcbiAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdGVcbiIsIlxuY2xhc3MgTWVudVN0YXRlIHtcblxuICBwcmVsb2FkKCkgeyB9XG5cbiAgY3JlYXRlKCkge1xuICAgIGxldCBsb2dvID0gdGhpcy5hZGQudGV4dChcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCxcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSxcbiAgICAgICdUcmluYWwgRmV0cmlzIElJJyxcbiAgICAgIHtmaWxsOiAnd2hpdGUnLCBmb250U2l6ZTogNzJ9XG4gICAgKVxuXG4gICAgbG9nby5hbmNob3Iuc2V0KDAuNSlcblxuICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnR2FtZScpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW51U3RhdGVcbiIsIlxuY2xhc3MgUHJlbG9hZFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMucHJlbG9hZEJhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAncHJlbG9hZCcpXG4gICAgXG4gICAgdGhpcy5wcmVsb2FkQmFyLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLnByZWxvYWRCYXIpXG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xvZ28nLCAnaW1nL2xvZ28ucG5nJylcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BubG9nbycsICdpbWcvcG5sb2dvLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWFpbk1lbnUnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRTdGF0ZVxuIiwiY2xhc3MgVGV0cmkge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgdGhpcy5ibG9ja3MgPSB7XG4gICAgICBUOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgSTogW1xuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICBdLFxuICAgICAgTDogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIEo6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBTOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgWjogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIE86IFtcbiAgICAgICAgWzEsIDFdLFxuICAgICAgICBbMSwgMV0sXG4gICAgICBdLFxuICAgIH1cbiAgfVxuXG4gIGdldEJsb2NrICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW3R5cGVdXG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV0cmlcbiIsIi8vIFBIQVNFUiBJUyBJTVBPUlRFRCBBUyBBTiBFWFRFUk5BTCBCVU5ETEUgSU4gSU5ERVguSFRNTFxuXG5QaGFzZXIuRGV2aWNlLndoZW5SZWFkeSgoKSA9PiB7XG4gIGNvbnN0IGJvb3RTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0Jvb3RTdGF0ZScpXG4gIGNvbnN0IHByZWxvYWRTdGF0ZSAgPSByZXF1aXJlKCcuL1ByZWxvYWRTdGF0ZScpXG4gIGNvbnN0IG1lbnVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL01lbnVTdGF0ZScpXG4gIGNvbnN0IGdhbWVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0dhbWVTdGF0ZScpXG5cbiAgY29uc3QgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg2MDAsIDcyMCwgUGhhc2VyLkFVVE8sICdnYW1lJylcblxuICBnYW1lLnN0YWdlLmJhY2tncm91bmRDb2xvciA9IDB4MjQyNDMyXG5cbiAgZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG4gIGdhbWUuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcblxuICAvLyBnYW1lLnNjYWxlLnNldE1pbk1heCg4MDAsIDYwMClcblxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZVxuXG4gIGdhbWUuc3RhdGUuYWRkKCdCb290JywgICAgICBib290U3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdQcmVsb2FkJywgICBwcmVsb2FkU3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdNYWluTWVudScsICBtZW51U3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdHYW1lJywgICAgICBnYW1lU3RhdGUpXG5cbiAgZ2FtZS5zdGF0ZS5zdGFydCgnQm9vdCcpXG59KVxuIl19
