/* eslint-disable no-labels, complexity */

const Tetris = require('./Object/Tetris')
const Player = require('./Object/PlayerManager/Player')
const BattleManager = require('./Object/BattleManager')
const Phaser = require('phaser-ce')

class GameState extends Phaser.State {

  preload() {
    this.load.spritesheet('plains', 'img/background/Plains.gif', 512, 64)
    this.load.spritesheet('desert', 'img/background/Desert.gif', 512, 64)
    this.load.spritesheet('forest', 'img/background/Forest.gif', 512, 64)
    this.load.spritesheet('sea', 'img/background/Sea.gif', 512, 64)
    this.load.spritesheet('snow', 'img/background/Snow.gif', 512, 64)
    this.load.spritesheet('swamp', 'img/background/Swamp.gif', 512, 64)

    this.load.image('background', 'img/UIFrames.png')
    this.load.bitmapFont('fantasy', 'img/font/font.png', 'img/font/font.fnt')
    this.load.image('addSkillPoint', 'img/addskillpoint.png')
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
    this.load.image('cursor', 'img/cursor.png')

    this.load.audio('battleMusic', 'audio/Battle_Scene.mp3')
    this.load.audio('walkMusic', 'audio/Main_Theme.mp3')
    this.load.audio('victoryMusic', 'audio/Victory_Fanfare.mp3')

    this.load.spritesheet('cureSprite', 'img/attacks/cureSpritesheet.png', 100, 100)
    this.load.spritesheet('fireSprite', 'img/attacks/fireSpritesheet.png', 100, 100)
    this.load.spritesheet('iceSprite', 'img/attacks/iceSpritesheet.png', 100, 100)
    this.load.spritesheet('boltSprite', 'img/attacks/boltSpritesheet.png', 100, 100)

    this.load.audio('cureSound', 'audio/cure.wav')
    this.load.audio('slashSound', 'audio/slash.wav')
    this.load.audio('enemySound', 'audio/enemyAttack.wav')
    this.load.audio('fireSound', 'audio/fire.wav')
    this.load.audio('boltSound', 'audio/bolt.wav')
    this.load.audio('iceSound', 'audio/ice.wav')
  }

  create() {

    this.game.sounds = {}
    this.game.sounds.enemy = this.sound.add('enemySound', 1, false, true)
    this.game.sounds.slash = this.sound.add('slashSound', 0.5, false, true)
    this.game.sounds.cure = this.sound.add('cureSound', 0.5, false, true)
    this.game.sounds.fire = this.sound.add('fireSound', 0.5, false, true)
    this.game.sounds.ice = this.sound.add('iceSound', 0.5, false, true)
    this.game.sounds.bolt = this.sound.add('boltSound', 0.5, false, true)

    this.add.image(0, 0, 'background')

    //set all backgrounds but not visible
    this.game.background = ['plains', 'desert', 'forest', 'sea', 'snow', 'swamp'].map( bg => {
      const bgImg = this.add.tileSprite(0, 0, 640, 64, bg)
      bgImg.scale.setTo(2, 2)
      bgImg.visible = false
      return bgImg
    })
    //show first background initially
    this.game.backgroundIdx = 0
    this.game.background[this.game.backgroundIdx].visible = true

    this.game.inBattle = false
    this.game.moveCount = 0

    this.game.victorySong = this.sound.add('victoryMusic', 1, false, true)
    this.game.battleSong = this.sound.add('battleMusic', 0.5, true, true)
    this.game.walkingSong = this.sound.add('walkMusic', 0.5, true, true)
    this.game.walkingSong.play()
    this.game.victorySong.onStop.add(() => { this.game.walkingSong.play()})

    this.game.isInControl = true
    this.createSignals()

    this.tetris = new Tetris(this.game);
    this.tetris.draw()

    this.player = new Player(this.game)
    this.player.initialize()

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
    this.game.signals.attackAll = new Phaser.Signal()
    this.game.signals.castFire = new Phaser.Signal()
    this.game.signals.castCure = new Phaser.Signal()
    this.game.signals.castBolt = new Phaser.Signal()
    this.game.signals.castIce = new Phaser.Signal()
    this.game.signals.hitAllEnemies = new Phaser.Signal()

    this.game.signals.inControl.add(this.setControlOfTetris, this)
    this.game.signals.castCure.add(this.animateCure, this)

    this.game.signals.gameOver = new Phaser.Signal()
    this.game.signals.gameOver.add(this.gameOver, this)
  }

  setControlOfTetris (bool){
    this.game.isInControl = bool
  }

  update() {
    //if not in battle move the background to the left
    if (!this.game.inBattle) {
      this.game.background[this.game.backgroundIdx].tilePosition.x -= 1
    }

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

  animateCure() {
    const cureSprite = this.game.add.sprite(780, 240, 'cureSprite')
    cureSprite.scale.setTo(3, 3)
    const cureAnimation = cureSprite.animations.add('cureAnimation', null, 24, false)
    cureAnimation.killOnComplete = true

    cureAnimation.play()
    this.game.sounds.cure.play()
  }

  gameOver() {
    this.sound.stopAll()
    this.state.start('GameOver')
  }

}

module.exports = GameState
