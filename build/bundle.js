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
  moveBlock(x, y) {
    this.player.pos.x += x
    this.player.pos.y += y
    if (this.collide()) {
      this.player.pos.x -= x
      this.player.pos.y -= y
      this.merge()
      this.player.pos.y = 1
      this.player.pos.x = 3
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBCb290U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkJywgJ2ltZy9wcmVsb2FkLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290U3RhdGVcbiIsInZhciBUZXRyaSA9IHJlcXVpcmUoJy4vVGV0cmkuanMnKVxuXG5jbGFzcyBHYW1lU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdibG9ja3MnLCAnaW1nL2Jsb2Nrcy5wbmcnLCAzMiwgMzIsIDcpXG4gICAgdGhpcy5CTE9DS19TQ0FMRSA9IDMyXG5cbiAgICB0aGlzLmJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgdGhpcy5wbGF5ZXIgPSB7XG4gICAgICBwb3M6IHt4OiAzLCB5OiAxfSxcbiAgICAgIG1hdHJpeDogdGhpcy5ibG9ja3MuZ2V0QmxvY2soJ1QnKVxuICAgIH1cbiAgfVxuXG4gIGNvbGxpZGUoKSB7XG4gICAgY29uc3QgW20sIG9dID0gW3RoaXMucGxheWVyLm1hdHJpeCwgdGhpcy5wbGF5ZXIucG9zXVxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbS5sZW5ndGg7ICsreSkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBtW3ldLmxlbmd0aDsgKyt4KSB7XG4gICAgICAgIGlmIChtW3ldW3hdICE9PSAwICYmXG4gICAgICAgICAgKHRoaXMuYXJlbmFbeSArIG8ueV0gJiZcbiAgICAgICAgICAgIHRoaXMuYXJlbmFbeSArIG8ueV1beCArIG8ueF0pICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgLy8gdmFsdWVzIG5lZWRlZCB0byBoYW5kbGUgdXBkYXRlc1xuICAgIHRoaXMuY3VyclRpbWUgPSAwXG4gICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICB0aGlzLmNhbk1vdmUgPSB0cnVlXG5cbiAgICB0aGlzLmJvYXJkU3RhdGUgPSB0aGlzLmFkZC5ncm91cCgpXG4gICAgdGhpcy5hcmVuYSA9IHRoaXMuY3JlYXRlTWF0cml4KDEwLCAyMilcblxuICAgIC8vIGN1cnJlbnRCbG9jayAtIENSRUFURVxuICAgIGNvbnN0IHR5cGVzID0gJ0lMSk9UU1onXG4gICAgZnVuY3Rpb24gcmFuZG9tVHlwZSAoKSB7XG4gICAgICByZXR1cm4gdHlwZXNbTWF0aC5mbG9vcih0eXBlcy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV1cbiAgICB9XG4gICAgdGhpcy50ZXRyaXNCbG9jayA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICBjb25zdCB0eXBlID0gcmFuZG9tVHlwZSgpXG5cbiAgICAvLyBrZXlib2FyZCBsaXN0ZW5lcnNcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICB1cEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuVVApLFxuICAgICAgZG93bktleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRE9XTiksXG4gICAgICBsZWZ0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5MRUZUKSxcbiAgICAgIHJpZ2h0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5SSUdIVCksXG4gICAgICBxS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5RKSxcbiAgICAgIGVLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkUpLFxuICAgIH1cblxuICB9XG5cbiAgY3JlYXRlTWF0cml4KHcsIGgpIHtcbiAgICB0aGlzLm5ld01hdHJpeCA9IFtdXG4gICAgd2hpbGUgKGgtLSkge1xuICAgICAgdGhpcy5uZXdNYXRyaXgucHVzaChuZXcgQXJyYXkodykuZmlsbCgwKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3TWF0cml4XG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMudGV0cmlzQmxvY2sua2lsbEFsbCgpXG4gICAgdGhpcy5ib2FyZFN0YXRlLmtpbGxBbGwoKVxuICAgIHRoaXMuZHJhd0Jsb2NrKHRoaXMucGxheWVyLm1hdHJpeCwgdGhpcy5wbGF5ZXIucG9zKVxuICAgIHRoaXMuZHJhd0JvYXJkKHRoaXMuYXJlbmEpXG4gIH1cbiAgLy8gY3VycmVudEJsb2NrIC0gRFJBV1MgQkxPQ0tcbiAgZHJhd0Jsb2NrKGJsb2NrLCBvZmZzZXQgPSB7eDogMCwgeTogMH0pIHtcbiAgICBibG9jay5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLnRldHJpc0Jsb2NrLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiAoeCArIG9mZnNldC54KSxcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiAoeSArIG9mZnNldC55KSxcbiAgICAgICAgICAgICdibG9ja3MnLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIC8vIGJvYXJkU3RhdGUgLSBEUkFXUyBCT0FSRFxuICBkcmF3Qm9hcmQoYmxhY2tNYXRyaXgpIHtcbiAgICBibGFja01hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICAgIHRoaXMuYm9hcmRTdGF0ZS5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLkJMT0NLX1NDQUxFICogeCxcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiB5LFxuICAgICAgICAgICAgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbWVyZ2UoKSB7XG4gICAgdGhpcy5wbGF5ZXIubWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMuYXJlbmFbeSArIHRoaXMucGxheWVyLnBvcy55XVt4ICsgdGhpcy5wbGF5ZXIucG9zLnhdID0gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLy8gY3VycmVudEJsb2NrIC0gYWxsb3dzIHVzIHRvIG1vdmUgYmxvY2tzXG4gIG1vdmVCbG9jayh4LCB5KSB7XG4gICAgdGhpcy5wbGF5ZXIucG9zLnggKz0geFxuICAgIHRoaXMucGxheWVyLnBvcy55ICs9IHlcbiAgICBpZiAodGhpcy5jb2xsaWRlKCkpIHtcbiAgICAgIHRoaXMucGxheWVyLnBvcy54IC09IHhcbiAgICAgIHRoaXMucGxheWVyLnBvcy55IC09IHlcbiAgICAgIHRoaXMubWVyZ2UoKVxuICAgICAgdGhpcy5wbGF5ZXIucG9zLnkgPSAxXG4gICAgICB0aGlzLnBsYXllci5wb3MueCA9IDNcbiAgICB9XG4gIH1cblxuICAvLyByb3RhdGUoZGlyKSB7XG4gIC8vICAgdGhpcy50ZXRyaXNCbG9jay5hbmdsZSArPSA5MCAqIGRpclxuICAvLyB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ2xvY2soKVxuICAgIHRoaXMuZHJhdygpXG5cbiAgICAvLyBhbGxvd3MgZm9yIGxlZnQgYW5kIHJpZ2h0IG1vdmVtZW50IG9mIGN1cnJlbnQgcGllY2VcbiAgICBpZiAodGhpcy5rZXlzLmxlZnRLZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKC0xLCAwKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLnJpZ2h0S2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLm1vdmVCbG9jaygxLCAwKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLmRvd25LZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKDAsIDEpXG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyBjbG9jayAtIFVQREFURVMgQU5EIE1PVkVTIFBJRUNFIEJBU0VEIE9OIFZBUklPVVMgUkFURVNcbiAgdXBkYXRlQ2xvY2socmF0ZSA9IDEpIHtcbiAgICAvLyBmYWxsIHRpbWVcbiAgICB0aGlzLmN1cnJUaW1lICs9IHRoaXMudGltZS5lbGFwc2VkICogcmF0ZVxuICAgIGlmICh0aGlzLmN1cnJUaW1lID4gMTAwMCl7XG4gICAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgICAgdGhpcy5tb3ZlQmxvY2soMCwgMSlcbiAgICB9XG4gICAgLy8gbW92ZW1lbnQgdGltZVxuICAgIHRoaXMubW92ZVRpbWUgKz0gdGhpcy50aW1lLmVsYXBzZWRcbiAgICBpZiAodGhpcy5tb3ZlVGltZSA+IDI1MCl7XG4gICAgICB0aGlzLmNhbk1vdmUgPSB0cnVlXG4gICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVN0YXRlXG4iLCJcbmNsYXNzIE1lbnVTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHsgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICBsZXQgbG9nbyA9IHRoaXMuYWRkLnRleHQoXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclgsXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksXG4gICAgICAnVHJpbmFsIEZldHJpcyBJSScsXG4gICAgICB7ZmlsbDogJ3doaXRlJywgZm9udFNpemU6IDcyfVxuICAgIClcblxuICAgIGxvZ28uYW5jaG9yLnNldCgwLjUpXG5cbiAgICB0aGlzLmlucHV0Lm9uVGFwLmFkZE9uY2UoKHBvaW50ZXIpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7IH1cbiAgcmVuZGVyKCkgeyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVN0YXRlXG4iLCJcbmNsYXNzIFByZWxvYWRTdGF0ZSB7XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCwgXG4gICAgICB0aGlzLndvcmxkLmNlbnRlclksIFxuICAgICAgJ3ByZWxvYWQnKVxuICAgIFxuICAgIHRoaXMucHJlbG9hZEJhci5hbmNob3Iuc2V0KC41KVxuXG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkQmFyKVxuXG4gICAgdGhpcy5sb2FkLmltYWdlKCdsb2dvJywgJ2ltZy9sb2dvLnBuZycpXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwbmxvZ28nLCAnaW1nL3BubG9nby5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ01haW5NZW51JylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkU3RhdGVcbiIsImNsYXNzIFRldHJpIHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHRoaXMuYmxvY2tzID0ge1xuICAgICAgVDogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIEk6IFtcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgXSxcbiAgICAgIEw6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBKOiBbXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgUzogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgXSxcbiAgICAgIFo6IFtcbiAgICAgICAgWzAsIDAsIDBdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAxXSxcbiAgICAgIF0sXG4gICAgICBPOiBbXG4gICAgICAgIFsxLCAxXSxcbiAgICAgICAgWzEsIDFdLFxuICAgICAgXSxcbiAgICB9XG4gIH1cblxuICBnZXRCbG9jayAodHlwZSkge1xuICAgIHJldHVybiB0aGlzLmJsb2Nrc1t0eXBlXVxuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRldHJpXG4iLCIvLyBQSEFTRVIgSVMgSU1QT1JURUQgQVMgQU4gRVhURVJOQUwgQlVORExFIElOIElOREVYLkhUTUxcblxuUGhhc2VyLkRldmljZS53aGVuUmVhZHkoKCkgPT4ge1xuICBjb25zdCBib290U3RhdGUgICAgID0gcmVxdWlyZSgnLi9Cb290U3RhdGUnKVxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxuICBjb25zdCBtZW51U3RhdGUgICAgID0gcmVxdWlyZSgnLi9NZW51U3RhdGUnKVxuICBjb25zdCBnYW1lU3RhdGUgICAgID0gcmVxdWlyZSgnLi9HYW1lU3RhdGUnKVxuXG4gIGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNjAwLCA3MjAsIFBoYXNlci5BVVRPLCAnZ2FtZScpXG5cbiAgZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweDI0MjQzMlxuXG4gIGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICBnYW1lLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cbiAgLy8gZ2FtZS5zY2FsZS5zZXRNaW5NYXgoODAwLCA2MDApXG5cbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcblxuICBnYW1lLnN0YXRlLmFkZCgnQm9vdCcsICAgICAgYm9vdFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsICAgcHJlbG9hZFN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnTWFpbk1lbnUnLCAgbWVudVN0YXRlKVxuICBnYW1lLnN0YXRlLmFkZCgnR2FtZScsICAgICAgZ2FtZVN0YXRlKVxuXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ0Jvb3QnKVxufSlcbiJdfQ==
