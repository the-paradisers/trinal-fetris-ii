/* eslint-disable no-labels, complexity */
const {debounce} = require('lodash')

const Battle = require('./Object/Battle')
const Player = require('./Object/Player');
const Tetris = require('./Object/Tetris')
const Phaser = require('phaser-ce')

class GameState extends Phaser.State {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
  }

  create() {

    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      wKey: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      rKey: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
      spaceKey: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      escKey: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
    }

    this.keys.escKey.onUp.add(() => {this.game.paused = !this.game.paused})

    // For adding signals to access across game
    this.game.signals = {}
    this.player = new Player(this.game);
    this.player.initialize();
    this.tetris = new Tetris(this.game);

    // values needed to handle updates
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
    this.battle.initialize()
    this.battle.summonEnemies()
    // Set listeners (only player clear row attack for now)
    this.battle.setListeners()
    // Draw all enemies in group
    this.battle.children.forEach(enemy => {
      enemy.draw()
    })
    //////////////////////////////////////////////////////

    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      wKey: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      rKey: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
      spaceKey: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      escKey: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
    }

    this.keys.escKey.onUp.add(() => {this.game.paused = !this.game.paused})

    this.keys.qKey.onDown.add(() => this.game.signals.skillSignal.dispatch('q'))
    this.keys.wKey.onDown.add(() => this.game.signals.skillSignal.dispatch('w'))
    this.keys.eKey.onDown.add(() => this.game.signals.skillSignal.dispatch('e'))
    this.keys.rKey.onDown.add(() => this.game.signals.skillSignal.dispatch('r'))

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
    } else if (this.keys.spaceKey.isDown){
      this.tetris.move('fastDrop')
    }
    // if (this.keys.qKey.isDown) {
    //   this.game.signals.skillSignal.dispatch(10)
    // } else if (this.keys.wKey.isDown) {
    //   this.game.signals.skillSignal.dispatch(20)
    // } else if (this.keys.eKey.isDown) {
    //   this.game.signals.skillSignal.dispatch(30)
    // } else if (this.keys.rKey.isDown) {
    //   this.game.signals.skillSignal.dispatch(40)
    // }
  }

  render() {}
}

module.exports = GameState
