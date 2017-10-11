/* eslint-disable no-labels, complexity */

const Tetris = require('./Object/Tetris')
const Player = require('./Object/Player')
const BattleManager = require('./Object/BattleManager')
const Phaser = require('phaser-ce')

class GameState extends Phaser.State {

  preload() {
    this.load.image('background', 'img/UIFrames.png')
    this.load.bitmapFont('fantasy', 'img/font/font.png', 'img/font/font.fnt')
    this.load.image('addSkillPoint', 'img/addskillpoint.png')
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
    this.load.spritesheet('plains', 'img/background/Plains.gif', 512, 64)
    this.load.image('cursor', 'img/cursor.png')

    this.load.audio('battleMusic', 'audio/Battle_Scene.mp3')
    this.load.audio('walkMusic', 'audio/Main_Theme.mp3')
    this.load.audio('victoryMusic', 'audio/Victory_Fanfare.mp3')

    this.load.spritesheet('cureAnimation', 'img/attacks/cureSpritesheet.png', 100, 100)
    this.load.spritesheet('fireAnimation', 'img/attacks/fireSpritesheet.png', 100, 100)

    this.load.audio('cure', 'audio/cure.wav')
    this.load.audio('slash', 'audio/slash.wav')
    this.load.audio('enemy', 'audio/enemyAttack.wav')
    this.load.audio('fire', 'audio/fire.wav')
    this.load.audio('bolt', 'audio/bolt.wav')
    this.load.audio('ice', 'audio/ice.wav')
  }

  create() {


    this.game.enemySound = this.sound.add('enemy', 1, false, true)
    this.game.slash = this.sound.add('slash', 0.5, false, true)
    this.game.cure = this.sound.add('cure', 0.5, false, true)
    this.game.fire = this.sound.add('fire', 0.5, false, true)
    this.game.ice = this.sound.add('ice', 0.5, false, true)
    this.game.bolt = this.sound.add('bolt', 0.5, false, true)

    this.add.image(0, 0, 'background')
    const plains = this.add.tileSprite(0, 0, 640, 64, 'plains')
    plains.scale.setTo(2, 2)

    this.game.inBattle = false
    this.game.moveCount = 0

    this.song = this.sound.add('walkMusic', 0.5, true, true)
    this.song.play()

    this.game.isInControl = true
    this.createSignals()

    this.tetris = new Tetris(this.game);
    this.tetris.draw()

    this.player = new Player(this.game)
    this.player.initialize()

    this.game.cureAnimation = this.game.add.sprite(780, 240, 'cureAnimation')
    this.game.cureAnimation.scale.setTo(3, 3)
    this.game.cureing = this.game.cureAnimation.animations.add('cureAnimation', null, 24, false )
    this.game.cureAnimation.visible = false
    this.game.cureing.onComplete.add(() => {this.game.cureAnimation.visible = false}, this)

    this.battleManager = new BattleManager(this.game)
    this.battleManager.initialize()

    this.setKeyMaps()
    this.setKeyListeners()
  }

  setKeyMaps() {
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
      oneKey: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
      twoKey: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
      threeKey: this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
      fourKey: this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
    }
  }

  setKeyListeners() {
    this.keys.escKey.onUp.add(() => {this.game.paused = !this.game.paused})
    this.keys.qKey.onDown.add(() => {
      if (this.game.inBattle && this.game.isInControl) this.game.signals.castSpell.dispatch('Q')})
    this.keys.wKey.onDown.add(() => {
      if (this.game.inBattle && this.game.isInControl) this.game.signals.castSpell.dispatch('W')})
    this.keys.eKey.onDown.add(() => {
      if (this.game.inBattle && this.game.isInControl) this.game.signals.castSpell.dispatch('E')})
    this.keys.rKey.onDown.add(() => {
      if (this.game.isInControl) this.game.signals.castSpell.dispatch('R')})
    this.keys.oneKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.selectTarget.dispatch(0)})
    this.keys.twoKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.selectTarget.dispatch(1)})
    this.keys.threeKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.selectTarget.dispatch(2)})
    this.keys.fourKey.onDown.add(() => {
      if (this.game.inBattle) this.game.signals.selectTarget.dispatch(3)})
  }

  createSignals() {
    this.game.signals = {}

    this.game.signals.hitEnemy = new Phaser.Signal()
    this.game.signals.writeLog = new Phaser.Signal()
    this.game.signals.endBattle = new Phaser.Signal()
    this.game.signals.castSpell = new Phaser.Signal()
    this.game.signals.addMana = new Phaser.Signal()
    this.game.signals.addExp = new Phaser.Signal()
    this.game.signals.selectTarget = new Phaser.Signal()
    this.game.signals.currentEnemies = new Phaser.Signal()
    this.game.signals.inControl = new Phaser.Signal()

    this.game.signals.inControl.add(this.setControlOfTetris, this)

    this.game.signals.fireAttack = new Phaser.Signal()
  }

  setControlOfTetris (bool){
    this.game.isInControl = bool
  }

  update() {
    if (!this.game.inBattle && this.game.moveCount > 7) {
      this.battleManager.startBattle()
    }

    this.tetris.clock(this.time.elapsed, this.game.isInControl, this.player.playerlvl)

    if (this.game.isInControl === true) {
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
  }

}

module.exports = GameState
