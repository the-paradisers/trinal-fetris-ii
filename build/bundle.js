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

class GameState {

  preload() { }

  create() {
    let pnlogo = this.add.image(
      this.world.centerX, 
      this.world.centerY, 
      'pnlogo')

    pnlogo.anchor.set(.5)
  }
  
  update() { }
  render() { }
}

module.exports = GameState

},{}],3:[function(require,module,exports){

class MenuState {

  preload() { }

  create() {
    let logo = this.add.image(
      this.world.centerX, 
      this.world.centerY, 
      'logo')
    
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
// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const menuState     = require('./MenuState')
  const gameState     = require('./GameState')

  const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

  game.stage.backgroundColor = 0x000000

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

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNsYXNzIEJvb3RTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWQnLCAnaW1nL3ByZWxvYWQucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMVxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RTdGF0ZVxuIiwiXG5jbGFzcyBHYW1lU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7IH1cblxuICBjcmVhdGUoKSB7XG4gICAgbGV0IHBubG9nbyA9IHRoaXMuYWRkLmltYWdlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAncG5sb2dvJylcblxuICAgIHBubG9nby5hbmNob3Iuc2V0KC41KVxuICB9XG4gIFxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLmltYWdlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAnbG9nbycpXG4gICAgXG4gICAgbG9nby5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5pbnB1dC5vblRhcC5hZGRPbmNlKChwb2ludGVyKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdHYW1lJylcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVTdGF0ZVxuIiwiXG5jbGFzcyBQcmVsb2FkU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5wcmVsb2FkQmFyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsIFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLCBcbiAgICAgICdwcmVsb2FkJylcbiAgICBcbiAgICB0aGlzLnByZWxvYWRCYXIuYW5jaG9yLnNldCguNSlcblxuICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZEJhcilcblxuICAgIHRoaXMubG9hZC5pbWFnZSgnbG9nbycsICdpbWcvbG9nby5wbmcnKVxuICAgIHRoaXMubG9hZC5pbWFnZSgncG5sb2dvJywgJ2ltZy9wbmxvZ28ucG5nJylcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdNYWluTWVudScpXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZFN0YXRlXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoODAwLCA2MDAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG5cbiAgZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMFxuXG4gIGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICBnYW1lLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cbiAgZ2FtZS5zY2FsZS5zZXRNaW5NYXgoODAwLCA2MDApXG5cbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcblxuICBnYW1lLnN0YXRlLmFkZCgnQm9vdCcsICAgICAgYm9vdFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsICAgcHJlbG9hZFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnTWFpbk1lbnUnLCAgbWVudVN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnR2FtZScsICAgICAgZ2FtZVN0YXRlKVxuXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0Jvb3QnKVxufSlcbiJdfQ==
