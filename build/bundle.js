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

},{"./Tetri.js":5}],3:[function(require,module,exports){

class MenuState {

  preload() { }

  create() {
    let logo = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Trinal Fetris II')

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
  constructor() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBCb290U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkJywgJ2ltZy9wcmVsb2FkLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290U3RhdGVcbiIsInZhciBUZXRyaSA9IHJlcXVpcmUoJy4vVGV0cmkuanMnKVxuXG5jbGFzcyBHYW1lU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdibG9ja3MnLCAnaW1nL2Jsb2Nrcy5wbmcnLCAzMiwgMzIsIDcpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5jdXJyVGltZSA9IHRoaXMudGltZS5ub3cgLyAxMFxuXG4gICAgY29uc3QgQmxvY2tzID0gbmV3IFRldHJpKClcbiAgICBjb25zdCBteUIgPSBCbG9ja3MuZ2V0QmxvY2soJ0wnKVxuXG4gICAgdGhpcy5kcmF3Qm9hcmQoXG4gICAgICBbXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIF1cbiAgICApXG5cbiAgICB0aGlzLmRyYXdCbG9jayhteUIpXG5cbiAgfVxuXG4gIGRyYXdCbG9jayhibGFja01hdHJpeCkge1xuICAgIGJsYWNrTWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMuYWRkLnNwcml0ZSgzMiAqIHggKyA0ODAsIDMyICogeSArIDgwLCAnYmxvY2tzJywgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRyYXdCb2FyZChibGFja01hdHJpeCkge1xuICAgIGJsYWNrTWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIC8vIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMuYWRkLnNwcml0ZSgzMiAqIHggKyA0ODAsIDMyICogeSArIDgwLCAnYmxvY2tzJywgdmFsdWUpXG4gICAgICAgIC8vIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmN1cnJUaW1lKytcbiAgICBpZiAodGhpcy5jdXJyVGltZSA+PSA2MCkge1xuICAgICAgdGhpcy5jdXJyVGltZSA9IDBcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy5jdXJyVGltZSlcbiAgfVxuXG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0ZVxuIiwiXG5jbGFzcyBNZW51U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7IH1cblxuICBjcmVhdGUoKSB7XG4gICAgbGV0IGxvZ28gPSB0aGlzLmFkZC50ZXh0KFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLFxuICAgICAgJ1RyaW5hbCBGZXRyaXMgSUknKVxuXG4gICAgbG9nby5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5pbnB1dC5vblRhcC5hZGRPbmNlKChwb2ludGVyKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdHYW1lJylcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVTdGF0ZVxuIiwiXG5jbGFzcyBQcmVsb2FkU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5wcmVsb2FkQmFyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsIFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLCBcbiAgICAgICdwcmVsb2FkJylcbiAgICBcbiAgICB0aGlzLnByZWxvYWRCYXIuYW5jaG9yLnNldCguNSlcblxuICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZEJhcilcblxuICAgIHRoaXMubG9hZC5pbWFnZSgnbG9nbycsICdpbWcvbG9nby5wbmcnKVxuICAgIHRoaXMubG9hZC5pbWFnZSgncG5sb2dvJywgJ2ltZy9wbmxvZ28ucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdNYWluTWVudScpXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZFN0YXRlXG4iLCJjbGFzcyBUZXRyaSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYmxvY2tzID0ge1xuICAgICAgVDogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIEk6IFtcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgXSxcbiAgICAgIEw6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBKOiBbXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgUzogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIFo6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBPOiBbXG4gICAgICAgIFsxLCAxXSxcbiAgICAgICAgWzEsIDFdLFxuICAgICAgXSxcbiAgICB9XG4gIH1cblxuICBnZXRCbG9jayAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLmJsb2Nrc1t0eXBlXVxuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRldHJpXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTI4MCwgNzIwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxuXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHgyNDI0MzJcblxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXG4gIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKVxuXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG5cbiAgZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCAgICAgIGJvb3RTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCAgIHByZWxvYWRTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01haW5NZW51JywgIG1lbnVTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCAgICAgIGdhbWVTdGF0ZSlcblxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jylcbn0pXG4iXX0=
