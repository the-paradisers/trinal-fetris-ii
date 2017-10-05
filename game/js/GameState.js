/* eslint-disable no-labels, complexity */

const Battle = require('./Object/Battle')
const Tetris = require('./Object/Tetris')
const Phaser = require('phaser-ce')

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
  }

  create() {
    // For adding signals to access across game
    this.game.signals = {}

    this.tetris = new Tetris(this.game)
    this.tetris.draw()

    // Battle
    ///////////////////////////////////////////////////
    const enemyData1 = {
      frame: 0,
      name: 'Werewolf',
      level: 1,
      HP: 10,
    }
    const enemyData2 = {
      frame: 1,
      name: 'Devil Wolf',
      level: 1,
      HP: 12,
    }
    const enemyData3 = {
      frame: 2,
      name: 'Werepanther',
      level: 1,
      HP: 14,
    }
    const enemyGroup = [enemyData1, enemyData2, enemyData3]
    this.battle = new Battle(this.game, enemyGroup)
    // Populate battle with enemies in enemyGroup
    this.battle.summonEnemies()
    // Set listeners (only player clear row attack for now)
    this.battle.setListeners()
    // Draw all enemies in group
    this.battle.children.forEach(enemy => enemy.draw())
    //////////////////////////////////////////////////////

    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
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
