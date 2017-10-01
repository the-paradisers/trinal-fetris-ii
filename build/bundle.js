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

  update() { }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNsYXNzIEJvb3RTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWQnLCAnaW1nL3ByZWxvYWQucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMVxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RTdGF0ZVxuIiwidmFyIFRldHJpID0gcmVxdWlyZSgnLi9UZXRyaS5qcycpXG5cbmNsYXNzIEdhbWVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Jsb2NrcycsICdpbWcvYmxvY2tzLnBuZycsIDMyLCAzMiwgNylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcblxuICAgIGNvbnN0IEJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgY29uc3QgbXlCID0gQmxvY2tzLmdldEJsb2NrKCdMJylcblxuICAgIHRoaXMuZHJhd0JvYXJkKFxuICAgICAgW1xuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICBdXG4gICAgKVxuXG4gICAgdGhpcy5kcmF3QmxvY2sobXlCKVxuXG4gIH1cblxuICBkcmF3QmxvY2soYmxhY2tNYXRyaXgpIHtcbiAgICBibGFja01hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmFkZC5zcHJpdGUoMzIgKiB4ICsgNDgwLCAzMiAqIHkgKyA4MCwgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkcmF3Qm9hcmQoYmxhY2tNYXRyaXgpIHtcbiAgICBibGFja01hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICAvLyBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmFkZC5zcHJpdGUoMzIgKiB4ICsgNDgwLCAzMiAqIHkgKyA4MCwgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgICAvLyB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScpXG5cbiAgICBsb2dvLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJcbmNsYXNzIFByZWxvYWRTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCwgXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksIFxuICAgICAgJ3ByZWxvYWQnKVxuICAgIFxuICAgIHRoaXMucHJlbG9hZEJhci5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkQmFyKVxuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdsb2dvJywgJ2ltZy9sb2dvLnBuZycpXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwbmxvZ28nLCAnaW1nL3BubG9nby5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkU3RhdGVcbiIsImNsYXNzIFRldHJpIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ibG9ja3MgPSB7XG4gICAgICBUOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgSTogW1xuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICBdLFxuICAgICAgTDogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIEo6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBTOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgWjogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIE86IFtcbiAgICAgICAgWzEsIDFdLFxuICAgICAgICBbMSwgMV0sXG4gICAgICBdLFxuICAgIH1cbiAgfVxuXG4gIGdldEJsb2NrICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW3R5cGVdXG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV0cmlcbiIsIi8vIFBIQVNFUiBJUyBJTVBPUlRFRCBBUyBBTiBFWFRFUk5BTCBCVU5ETEUgSU4gSU5ERVguSFRNTFxuXG5QaGFzZXIuRGV2aWNlLndoZW5SZWFkeSgoKSA9PiB7XG4gIGNvbnN0IGJvb3RTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0Jvb3RTdGF0ZScpXG4gIGNvbnN0IHByZWxvYWRTdGF0ZSAgPSByZXF1aXJlKCcuL1ByZWxvYWRTdGF0ZScpXG4gIGNvbnN0IG1lbnVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL01lbnVTdGF0ZScpXG4gIGNvbnN0IGdhbWVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0dhbWVTdGF0ZScpXG5cbiAgY29uc3QgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSgxMjgwLCA3MjAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG5cbiAgZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweDI0MjQzMlxuXG4gIGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICBnYW1lLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cbiAgZ2FtZS5zY2FsZS5zZXRNaW5NYXgoODAwLCA2MDApXG5cbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcblxuICBnYW1lLnN0YXRlLmFkZCgnQm9vdCcsICAgICAgYm9vdFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsICAgcHJlbG9hZFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnTWFpbk1lbnUnLCAgbWVudVN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnR2FtZScsICAgICAgZ2FtZVN0YXRlKVxuXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0Jvb3QnKVxufSlcbiJdfQ==
