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
    // let logo = this.add.image(
    //   this.world.centerX,
    //   this.world.centerY,
    //   'logo')

    let gameName = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Trinal Fetris II',
      { fill: 'white' }
    )

    gameName.anchor.set(0.5)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY2xhc3MgQm9vdFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZCcsICdpbWcvcHJlbG9hZC5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuaW5wdXQubWF4UG9pbnRlcnMgPSAxXG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdFN0YXRlXG4iLCJcbmNsYXNzIEdhbWVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgcG5sb2dvID0gdGhpcy5hZGQuaW1hZ2UoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsIFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLCBcbiAgICAgICdwbmxvZ28nKVxuXG4gICAgcG5sb2dvLmFuY2hvci5zZXQoLjUpXG4gIH1cbiAgXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdGVcbiIsIlxuY2xhc3MgTWVudVN0YXRlIHtcblxuICBwcmVsb2FkKCkgeyB9XG5cbiAgY3JlYXRlKCkge1xuICAgIC8vIGxldCBsb2dvID0gdGhpcy5hZGQuaW1hZ2UoXG4gICAgLy8gICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgLy8gICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgLy8gICAnbG9nbycpXG5cbiAgICBsZXQgZ2FtZU5hbWUgPSB0aGlzLmFkZC50ZXh0KFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLFxuICAgICAgJ1RyaW5hbCBGZXRyaXMgSUknLFxuICAgICAgeyBmaWxsOiAnd2hpdGUnIH1cbiAgICApXG5cbiAgICBnYW1lTmFtZS5hbmNob3Iuc2V0KDAuNSlcblxuICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnR2FtZScpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW51U3RhdGVcbiIsIlxuY2xhc3MgUHJlbG9hZFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMucHJlbG9hZEJhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAncHJlbG9hZCcpXG4gICAgXG4gICAgdGhpcy5wcmVsb2FkQmFyLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLnByZWxvYWRCYXIpXG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xvZ28nLCAnaW1nL2xvZ28ucG5nJylcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BubG9nbycsICdpbWcvcG5sb2dvLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWFpbk1lbnUnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRTdGF0ZVxuIiwiLy8gUEhBU0VSIElTIElNUE9SVEVEIEFTIEFOIEVYVEVSTkFMIEJVTkRMRSBJTiBJTkRFWC5IVE1MXG5cblBoYXNlci5EZXZpY2Uud2hlblJlYWR5KCgpID0+IHtcbiAgY29uc3QgYm9vdFN0YXRlICAgICA9IHJlcXVpcmUoJy4vQm9vdFN0YXRlJylcbiAgY29uc3QgcHJlbG9hZFN0YXRlICA9IHJlcXVpcmUoJy4vUHJlbG9hZFN0YXRlJylcbiAgY29uc3QgbWVudVN0YXRlICAgICA9IHJlcXVpcmUoJy4vTWVudVN0YXRlJylcbiAgY29uc3QgZ2FtZVN0YXRlICAgICA9IHJlcXVpcmUoJy4vR2FtZVN0YXRlJylcblxuICBjb25zdCBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDgwMCwgNjAwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKVxuXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHgwMDAwMDBcblxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuXG4gIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKVxuXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG5cbiAgZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCAgICAgIGJvb3RTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCAgIHByZWxvYWRTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01haW5NZW51JywgIG1lbnVTdGF0ZSlcbiAgZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCAgICAgIGdhbWVTdGF0ZSlcblxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jylcbn0pXG4iXX0=
