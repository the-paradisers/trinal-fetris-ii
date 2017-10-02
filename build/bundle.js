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
    if (this.moveTime > 100){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3BoYXNlci1ub2RlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvanMvQm9vdFN0YXRlLmpzIiwiYnVpbGQvanMvR2FtZVN0YXRlLmpzIiwiYnVpbGQvanMvTWVudVN0YXRlLmpzIiwiYnVpbGQvanMvUHJlbG9hZFN0YXRlLmpzIiwiYnVpbGQvanMvVGV0cmkuanMiLCJidWlsZC9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBCb290U3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkJywgJ2ltZy9wcmVsb2FkLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJylcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290U3RhdGVcbiIsInZhciBUZXRyaSA9IHJlcXVpcmUoJy4vVGV0cmkuanMnKVxuXG5jbGFzcyBHYW1lU3RhdGUge1xuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdibG9ja3MnLCAnaW1nL2Jsb2Nrcy5wbmcnLCAzMiwgMzIsIDcpXG4gICAgdGhpcy5CTE9DS19TQ0FMRSA9IDMyXG5cbiAgICB0aGlzLmJsb2NrcyA9IG5ldyBUZXRyaSgpXG4gICAgdGhpcy5wbGF5ZXIgPSB7XG4gICAgICBwb3M6IHt4OiAzLCB5OiAxfSxcbiAgICAgIG1hdHJpeDogdGhpcy5ibG9ja3MuZ2V0QmxvY2soJ1QnKVxuICAgIH1cbiAgfVxuXG4gIGNvbGxpZGUoKSB7XG4gICAgY29uc3QgW20sIG9dID0gW3RoaXMucGxheWVyLm1hdHJpeCwgdGhpcy5wbGF5ZXIucG9zXVxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbS5sZW5ndGg7ICsreSkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBtW3ldLmxlbmd0aDsgKyt4KSB7XG4gICAgICAgIGlmIChtW3ldW3hdICE9PSAwICYmXG4gICAgICAgICAgKHRoaXMuYXJlbmFbeSArIG8ueV0gJiZcbiAgICAgICAgICAgIHRoaXMuYXJlbmFbeSArIG8ueV1beCArIG8ueF0pICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgLy8gdmFsdWVzIG5lZWRlZCB0byBoYW5kbGUgdXBkYXRlc1xuICAgIHRoaXMuY3VyclRpbWUgPSAwXG4gICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICB0aGlzLmNhbk1vdmUgPSB0cnVlXG5cbiAgICB0aGlzLmJvYXJkU3RhdGUgPSB0aGlzLmFkZC5ncm91cCgpXG4gICAgdGhpcy5hcmVuYSA9IHRoaXMuY3JlYXRlTWF0cml4KDEwLCAyMilcblxuICAgIC8vIGN1cnJlbnRCbG9jayAtIENSRUFURVxuICAgIGNvbnN0IHR5cGVzID0gJ0lMSk9UU1onXG4gICAgZnVuY3Rpb24gcmFuZG9tVHlwZSAoKSB7XG4gICAgICByZXR1cm4gdHlwZXNbTWF0aC5mbG9vcih0eXBlcy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV1cbiAgICB9XG4gICAgdGhpcy50ZXRyaXNCbG9jayA9IHRoaXMuYWRkLmdyb3VwKClcbiAgICBjb25zdCB0eXBlID0gcmFuZG9tVHlwZSgpXG5cbiAgICAvLyBrZXlib2FyZCBsaXN0ZW5lcnNcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICB1cEtleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuVVApLFxuICAgICAgZG93bktleTogdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRE9XTiksXG4gICAgICBsZWZ0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5MRUZUKSxcbiAgICAgIHJpZ2h0S2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5SSUdIVCksXG4gICAgICBxS2V5OiB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5RKSxcbiAgICAgIGVLZXk6IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkUpLFxuICAgIH1cblxuICB9XG5cbiAgY3JlYXRlTWF0cml4KHcsIGgpIHtcbiAgICB0aGlzLm5ld01hdHJpeCA9IFtdXG4gICAgd2hpbGUgKGgtLSkge1xuICAgICAgdGhpcy5uZXdNYXRyaXgucHVzaChuZXcgQXJyYXkodykuZmlsbCgwKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3TWF0cml4XG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMudGV0cmlzQmxvY2sua2lsbEFsbCgpXG4gICAgdGhpcy5ib2FyZFN0YXRlLmtpbGxBbGwoKVxuICAgIHRoaXMuZHJhd0Jsb2NrKHRoaXMucGxheWVyLm1hdHJpeCwgdGhpcy5wbGF5ZXIucG9zKVxuICAgIHRoaXMuZHJhd0JvYXJkKHRoaXMuYXJlbmEpXG4gIH1cbiAgLy8gY3VycmVudEJsb2NrIC0gRFJBV1MgQkxPQ0tcbiAgZHJhd0Jsb2NrKGJsb2NrLCBvZmZzZXQgPSB7eDogMCwgeTogMH0pIHtcbiAgICBibG9jay5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLnRldHJpc0Jsb2NrLmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiAoeCArIG9mZnNldC54KSxcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiAoeSArIG9mZnNldC55KSxcbiAgICAgICAgICAgICdibG9ja3MnLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIC8vIGJvYXJkU3RhdGUgLSBEUkFXUyBCT0FSRFxuICBkcmF3Qm9hcmQoYmxhY2tNYXRyaXgpIHtcbiAgICBibGFja01hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xuICAgICAgICAgIHRoaXMuYm9hcmRTdGF0ZS5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLkJMT0NLX1NDQUxFICogeCxcbiAgICAgICAgICAgIHRoaXMuQkxPQ0tfU0NBTEUgKiB5LFxuICAgICAgICAgICAgJ2Jsb2NrcycsIHZhbHVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbWVyZ2UoKSB7XG4gICAgdGhpcy5wbGF5ZXIubWF0cml4LmZvckVhY2goKHJvdywgeSkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgIHRoaXMuYXJlbmFbeSArIHRoaXMucGxheWVyLnBvcy55XVt4ICsgdGhpcy5wbGF5ZXIucG9zLnhdID0gdmFsdWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLy8gY3VycmVudEJsb2NrIC0gYWxsb3dzIHVzIHRvIG1vdmUgYmxvY2tzXG4gIGRyb3BCbG9jaygpIHtcbiAgICB0aGlzLnBsYXllci5wb3MueSsrXG4gICAgaWYgKHRoaXMuY29sbGlkZSgpKSB7XG4gICAgICB0aGlzLnBsYXllci5wb3MueS0tXG4gICAgICB0aGlzLm1lcmdlKClcbiAgICAgIHRoaXMucGxheWVyLnBvcyA9IHt4OiAzLCB5OiAwfVxuICAgIH1cbiAgfVxuXG4gIG1vdmVCbG9jayhkaXIpIHtcbiAgICB0aGlzLnBsYXllci5wb3MueCArPSBkaXJcbiAgICBpZiAodGhpcy5jb2xsaWRlKCkpIHtcbiAgICAgIHRoaXMucGxheWVyLnBvcy54IC09IGRpclxuICAgIH1cbiAgfVxuXG4gIHJvdGF0ZSh0dXJuID0gdHJ1ZSkge1xuICAgIGNvbnN0IG1hdHJpeCA9IHRoaXMucGxheWVyLm1hdHJpeFxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbWF0cml4Lmxlbmd0aDsgKyt5KSB7XG4gICAgICBmb3IgKCBsZXQgeCA9IDA7IHggPCB5OyArK3gpIHtcbiAgICAgICAgW1xuICAgICAgICAgIG1hdHJpeFt4XVt5XSxcbiAgICAgICAgICBtYXRyaXhbeV1beF0sXG4gICAgICAgIF0gPSBbXG4gICAgICAgICAgbWF0cml4W3ldW3hdLFxuICAgICAgICAgIG1hdHJpeFt4XVt5XSxcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHVybikge1xuICAgICAgbWF0cml4LmZvckVhY2gocm93ID0+IHJvdy5yZXZlcnNlKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdHJpeC5yZXZlcnNlKClcbiAgICB9XG4gIH1cblxuICBwbGF5ZXJSb3RhdGUoKSB7XG4gICAgdGhpcy5yb3RhdGUoKVxuICAgIGxldCBvZmZzZXQgPSAxXG4gICAgd2hpbGUgKHRoaXMuY29sbGlkZSgpKSB7XG4gICAgICB0aGlzLnBsYXllci5wb3MueCArPSBvZmZzZXRcbiAgICAgIG9mZnNldCA9IC0ob2Zmc2V0ICsgKG9mZnNldCA+IDAgPyAxIDogLTEpKVxuICAgICAgaWYgKG9mZnNldCA+IHRoaXMucGxheWVyLm1hdHJpeFswXS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yb3RhdGUoZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDbG9jaygpXG4gICAgdGhpcy5kcmF3KClcblxuICAgIC8vIGFsbG93cyBmb3IgbGVmdCBhbmQgcmlnaHQgbW92ZW1lbnQgb2YgY3VycmVudCBwaWVjZVxuICAgIGlmICh0aGlzLmtleXMubGVmdEtleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5tb3ZlQmxvY2soLTEpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmtleXMucmlnaHRLZXkuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKDEpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmtleXMuZG93bktleS5pc0Rvd24pIHtcbiAgICAgIGlmICh0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb3ZlVGltZSA9IDBcbiAgICAgICAgdGhpcy5kcm9wQmxvY2soKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5rZXlzLnVwS2V5LmlzRG93bikge1xuICAgICAgaWYgKHRoaXMuY2FuTW92ZSkge1xuICAgICAgICB0aGlzLmNhbk1vdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLm1vdmVUaW1lID0gMFxuICAgICAgICB0aGlzLnBsYXllclJvdGF0ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyBjbG9jayAtIFVQREFURVMgQU5EIE1PVkVTIFBJRUNFIEJBU0VEIE9OIFZBUklPVVMgUkFURVNcbiAgdXBkYXRlQ2xvY2socmF0ZSA9IDEpIHtcbiAgICAvLyBmYWxsIHRpbWVcbiAgICB0aGlzLmN1cnJUaW1lICs9IHRoaXMudGltZS5lbGFwc2VkICogcmF0ZVxuICAgIGlmICh0aGlzLmN1cnJUaW1lID4gMTAwMCl7XG4gICAgICB0aGlzLmN1cnJUaW1lID0gMFxuICAgICAgdGhpcy5kcm9wQmxvY2soKVxuICAgIH1cbiAgICAvLyBtb3ZlbWVudCB0aW1lXG4gICAgdGhpcy5tb3ZlVGltZSArPSB0aGlzLnRpbWUuZWxhcHNlZFxuICAgIGlmICh0aGlzLm1vdmVUaW1lID4gMTAwKXtcbiAgICAgIHRoaXMuY2FuTW92ZSA9IHRydWVcbiAgICAgIHRoaXMubW92ZVRpbWUgPSAwXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdGVcbiIsIlxuY2xhc3MgTWVudVN0YXRlIHtcblxuICBwcmVsb2FkKCkgeyB9XG5cbiAgY3JlYXRlKCkge1xuICAgIGxldCBsb2dvID0gdGhpcy5hZGQudGV4dChcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCxcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSxcbiAgICAgICdUcmluYWwgRmV0cmlzIElJJyxcbiAgICAgIHtmaWxsOiAnd2hpdGUnLCBmb250U2l6ZTogNzJ9XG4gICAgKVxuXG4gICAgbG9nby5hbmNob3Iuc2V0KDAuNSlcblxuICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnR2FtZScpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHsgfVxuICByZW5kZXIoKSB7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW51U3RhdGVcbiIsIlxuY2xhc3MgUHJlbG9hZFN0YXRlIHtcblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMucHJlbG9hZEJhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKFxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXG4gICAgICAncHJlbG9hZCcpXG4gICAgXG4gICAgdGhpcy5wcmVsb2FkQmFyLmFuY2hvci5zZXQoLjUpXG5cbiAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLnByZWxvYWRCYXIpXG5cbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xvZ28nLCAnaW1nL2xvZ28ucG5nJylcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BubG9nbycsICdpbWcvcG5sb2dvLnBuZycpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWFpbk1lbnUnKVxuICB9XG5cbiAgdXBkYXRlKCkgeyB9XG4gIHJlbmRlcigpIHsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWRTdGF0ZVxuIiwiY2xhc3MgVGV0cmkge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgdGhpcy5ibG9ja3MgPSB7XG4gICAgICBUOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzEsIDEsIDFdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgSTogW1xuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICAgIFswLCAxLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMCwgMF0sXG4gICAgICBdLFxuICAgICAgTDogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIEo6IFtcbiAgICAgICAgWzAsIDEsIDBdLFxuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgIF0sXG4gICAgICBTOiBbXG4gICAgICAgIFswLCAwLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgICBbMSwgMSwgMF0sXG4gICAgICBdLFxuICAgICAgWjogW1xuICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgXSxcbiAgICAgIE86IFtcbiAgICAgICAgWzEsIDFdLFxuICAgICAgICBbMSwgMV0sXG4gICAgICBdLFxuICAgIH1cbiAgfVxuXG4gIGdldEJsb2NrICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW3R5cGVdXG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV0cmlcbiIsIi8vIFBIQVNFUiBJUyBJTVBPUlRFRCBBUyBBTiBFWFRFUk5BTCBCVU5ETEUgSU4gSU5ERVguSFRNTFxuXG5QaGFzZXIuRGV2aWNlLndoZW5SZWFkeSgoKSA9PiB7XG4gIGNvbnN0IGJvb3RTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0Jvb3RTdGF0ZScpXG4gIGNvbnN0IHByZWxvYWRTdGF0ZSAgPSByZXF1aXJlKCcuL1ByZWxvYWRTdGF0ZScpXG4gIGNvbnN0IG1lbnVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL01lbnVTdGF0ZScpXG4gIGNvbnN0IGdhbWVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL0dhbWVTdGF0ZScpXG5cbiAgY29uc3QgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg2MDAsIDcyMCwgUGhhc2VyLkFVVE8sICdnYW1lJylcblxuICBnYW1lLnN0YWdlLmJhY2tncm91bmRDb2xvciA9IDB4MjQyNDMyXG5cbiAgZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG4gIGdhbWUuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcblxuICAvLyBnYW1lLnNjYWxlLnNldE1pbk1heCg4MDAsIDYwMClcblxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlXG4gIGdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZVxuXG4gIGdhbWUuc3RhdGUuYWRkKCdCb290JywgICAgICBib290U3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdQcmVsb2FkJywgICBwcmVsb2FkU3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdNYWluTWVudScsICBtZW51U3RhdGUpXG4gIGdhbWUuc3RhdGUuYWRkKCdHYW1lJywgICAgICBnYW1lU3RhdGUpXG5cbiAgZ2FtZS5zdGF0ZS5zdGFydCgnQm9vdCcpXG59KVxuIl19
