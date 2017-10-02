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
    }

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
    const Blocks = new Tetri()
    this.tetrisBlock = this.add.group()
    this.drawBlock(Blocks.getBlock('L'))
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
      this.tetrisBlock.position.x += (x * 32)
      this.tetrisBlock.position.y += (y * 32)
  }

  update() {
    this.updateClock()

    // allows for left and right movement of current piece
    if (this.keys.leftKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(-1, 0)
      }
    }
    if (this.keys.rightKey.isDown) {
      if (this.canMove) {
        this.canMove = false
        this.moveTime = 0
        this.moveBlock(1, 0)
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
      {fill: 'white'}
    )

    logo.anchor.set(.5)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY2xhc3MgQm9vdFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZCcsICdpbWcvcHJlbG9hZC5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuaW5wdXQubWF4UG9pbnRlcnMgPSAxXG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdFN0YXRlXG4iLCJ2YXIgVGV0cmkgPSByZXF1aXJlKCcuL1RldHJpLmpzJylcblxuY2xhc3MgR2FtZVN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnYmxvY2tzJywgJ2ltZy9ibG9ja3MucG5nJywgMzIsIDMyLCA3KVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIC8vIHZhbHVlcyBuZWVkZWQgdG8gaGFuZGxlIHVwZGF0ZXNcbiAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgdGhpcy5jYW5Nb3ZlID0gdHJ1ZVxuXG4gICAgLy8ga2V5Ym9hcmQgbGlzdGVuZXJzXG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgdXBLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlVQKSxcbiAgICAgIGRvd25LZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkRPV04pLFxuICAgICAgbGVmdEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuTEVGVCksXG4gICAgICByaWdodEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuUklHSFQpLFxuICAgIH1cblxuICAgIC8vIGJvYXJkIC0gQ1JFQVRFXG4gICAgdGhpcy5ib2FyZFN0YXRlID0gdGhpcy5hZGQuZ3JvdXAoKVxuICAgIGNvbnN0IGJvYXJkID0gdGhpcy5kcmF3Qm9hcmQoW1xuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgIF0pXG5cbiAgICAvLyBjdXJyZW50QmxvY2sgLSBDUkVBVEVcbiAgICBjb25zdCBCbG9ja3MgPSBuZXcgVGV0cmkoKVxuICAgIHRoaXMudGV0cmlzQmxvY2sgPSB0aGlzLmFkZC5ncm91cCgpXG4gICAgdGhpcy5kcmF3QmxvY2soQmxvY2tzLmdldEJsb2NrKCdMJykpXG4gIH1cblxuICAvLyBjdXJyZW50QmxvY2sgLSBEUkFXUyBCTE9DS1xuICBkcmF3QmxvY2soYmxvY2spIHtcbiAgICBibG9jay5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLnRldHJpc0Jsb2NrLmNyZWF0ZSgzMiAqICh4KSwgMzIgKiAoeSksICdibG9ja3MnLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLy8gYm9hcmRTdGF0ZSAtIERSQVdTIEJPQVJEXG4gIGRyYXdCb2FyZChibGFja01hdHJpeCkge1xuICAgIGJsYWNrTWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgICAgdGhpcy5ib2FyZFN0YXRlLmNyZWF0ZSgzMiAqIHgsIDMyICogeSwgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLy8gY2xvY2sgLSBVUERBVEVTIEFORCBNT1ZFUyBQSUVDRSBCQVNFRCBPTiBWQVJJT1VTIFJBVEVTXG4gIHVwZGF0ZUNsb2NrKHJhdGUgPSAxKSB7XG4gICAgLy8gZmFsbCB0aW1lXG4gICAgdGhpcy5jdXJyVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZCAqIHJhdGVcbiAgICBpZiAodGhpcy5jdXJyVGltZSA+IDEwMDApe1xuICAgICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICAgIHRoaXMubW92ZUJsb2NrKDAsIDEpXG4gICAgfVxuICAgIC8vIG1vdmVtZW50IHRpbWVcbiAgICB0aGlzLm1vdmVUaW1lICs9IHRoaXMudGltZS5lbGFwc2VkXG4gICAgaWYgKHRoaXMubW92ZVRpbWUgPiAyNTApe1xuICAgICAgdGhpcy5jYW5Nb3ZlID0gdHJ1ZVxuICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICB9XG4gIH1cblxuICAvLyBjdXJyZW50QmxvY2sgLSBhbGxvd3MgdXMgdG8gbW92ZSBibG9ja3NcbiAgbW92ZUJsb2NrKHgsIHkpIHtcbiAgICAgIHRoaXMudGV0cmlzQmxvY2sucG9zaXRpb24ueCArPSAoeCAqIDMyKVxuICAgICAgdGhpcy50ZXRyaXNCbG9jay5wb3NpdGlvbi55ICs9ICh5ICogMzIpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDbG9jaygpXG5cbiAgICAvLyBhbGxvd3MgZm9yIGxlZnQgYW5kIHJpZ2h0IG1vdmVtZW50IG9mIGN1cnJlbnQgcGllY2VcbiAgICBpZiAodGhpcy5rZXlzLmxlZnRLZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKC0xLCAwKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5rZXlzLnJpZ2h0S2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygxLCAwKVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScsXG4gICAgICB7ZmlsbDogJ3doaXRlJ31cbiAgICApXG5cbiAgICBsb2dvLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJcbmNsYXNzIFByZWxvYWRTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCwgXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksIFxuICAgICAgJ3ByZWxvYWQnKVxuICAgIFxuICAgIHRoaXMucHJlbG9hZEJhci5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkQmFyKVxuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdsb2dvJywgJ2ltZy9sb2dvLnBuZycpXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwbmxvZ28nLCAnaW1nL3BubG9nby5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkU3RhdGVcbiIsImNsYXNzIFRldHJpIHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHRoaXMuYmxvY2tzID0ge1xuICAgICAgVDogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIEk6IFtcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgXSxcbiAgICAgIEw6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBKOiBbXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgUzogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIFo6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBPOiBbXG4gICAgICAgIFsxLCAxXSxcbiAgICAgICAgWzEsIDFdLFxuICAgICAgXSxcbiAgICB9XG4gIH1cblxuICBnZXRCbG9jayAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLmJsb2Nrc1t0eXBlXVxuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRldHJpXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTI4MCwgNzIwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxuXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHgyNDI0MzJcblxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXG4gIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKVxuXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG5cbiAgZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCAgICAgIGJvb3RTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCAgIHByZWxvYWRTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01haW5NZW51JywgIG1lbnVTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCAgICAgIGdhbWVTdGF0ZSlcblxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jylcbn0pXG4iXX0=
