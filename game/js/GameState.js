/* eslint-disable no-labels, complexity */
const Player = require('./Object/Player');
const Tetris = require('./Object/Tetris')
const Phaser = require('phaser-ce')

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
  }

  create() {
    this.tetris = new Tetris(this)
    this.player = new Player(this);
    this.player.initialize();

    // values needed to handle updates
    this.tetris.draw()
    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      wKey: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      rKey: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
    }
  }

  update() {
    this.tetris.clock(this.time.elapsed, 1)

    if (this.keys.leftKey.isDown) {
      this.tetris.move('left')
    } else if (this.keys.rightKey.isDown) {
      this.tetris.move('right')
    } else if (this.keys.downKey.isDown) {
      this.tetris.move('drop')
    } else if (this.keys.upKey.isDown) {
      this.tetris.move('rotate')
    }
  }

  render() {}
}

module.exports = GameState
