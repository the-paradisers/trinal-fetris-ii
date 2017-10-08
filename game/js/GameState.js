/* eslint-disable no-labels, complexity */

const Tetris = require('./Object/Tetris')
const Player = require('./Object/Player')
const BattleManager = require('./Object/BattleManager')
const Phaser = require('phaser-ce')

class GameState extends Phaser.State {

  preload() {
    this.load.image('background', 'img/TF2BACKGROUND.png')
    this.load.bitmapFont('fantasy', 'img/font/font.png', 'img/font/font.fnt')
    this.load.image('addSkillPoint', 'img/addskillpoint.png')
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
    this.load.spritesheet('plains', 'img/background/Plains.gif', 512, 64)

    this.load.audio('battleMusic', 'audio/Battle_Scene.mp3')
    this.load.audio('walkMusic', 'audio/Main_Theme.mp3')
    this.load.audio('victoryMusic', 'audio/Victory_Fanfare.mp3')
  }

  create() {
    this.add.image(0, 0, 'background')
    const plains = this.add.tileSprite(0, 0, 640, 64, 'plains')
    plains.scale.setTo(2, 2)

    this.game.inBattle = false
    this.game.moveCount = 0

    this.song = this.sound.add('walkMusic', 0.5, true, true)
    this.song.play()

    this.createSignals()

    this.tetris = new Tetris(this.game)
    this.tetris.draw()

    this.player = new Player(this.game)
    this.player.initialize()

    this.battleManager = new BattleManager(this.game)
    this.battleManager.initialize()

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

    this.keys.qKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.castSpell.dispatch('Q')})
    this.keys.wKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.castSpell.dispatch('W')})
    this.keys.eKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.castSpell.dispatch('E')})
    this.keys.rKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.castSpell.dispatch('R')})
  }

  createSignals() {
    this.game.signals = {}

    this.game.signals.hitEnemy = new Phaser.Signal()
    this.game.signals.writeLog = new Phaser.Signal()
    this.game.signals.endBattle = new Phaser.Signal()
    this.game.signals.castSpell = new Phaser.Signal()
    this.game.signals.addMana = new Phaser.Signal()
    this.game.signals.addExp = new Phaser.Signal()
  }

  update() {
    if (!this.game.inBattle && this.game.moveCount > 7) {
      this.battleManager.startBattle()
    }

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
  }

  render() {}
}

module.exports = GameState
