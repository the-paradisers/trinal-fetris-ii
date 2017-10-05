/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    this.currentMana = 150
    this.currentExp = 50
    //this.manabar
  }

  initialize () {
    this.renderMana()
    this.renderExp()
    this.initializeSignal()
    //Phaser.Signal
    //Phaser.Event.onDestory for experience bar
    this.initializePlayerSprite()
    this.initializeTimer()
  }

  renderMana () {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    const manabar = this.game.add.graphics(0, 0)
    manabar.beginFill(0x00d1ff, 1)
    manabar.drawRoundedRect(gameWidth - gameWidth/3, gameHeight-50, this.currentMana, 20, 10)
    manabar.endFill()

    this.manabar = manabar
  }

  renderExp () {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    const expbar = this.game.add.graphics(0, 0)
    expbar.beginFill(0xffff00, 1)
    expbar.drawRoundedRect(gameWidth - gameWidth/3, gameHeight-75, this.currentExp, 20, 10)
    expbar.endFill()

    this.expbar = expbar
  }

  initializeSignal () {
    const skillSignal = new Phaser.Signal()
    skillSignal.add(this.updateMana, this)

    const expSignal = new Phaser.Signal()
    expSignal.add(this.updateExp, this)

    this.game.playerSignal = {
      skillSignal,
      expSignal,
    }
  }

  initializePlayerSprite () {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.character = this.game.add.sprite(gameWidth - gameWidth/3, gameHeight-150, 'player')

    this.walk = this.character.animations.add('walk', [1, 0], 4, true)

    this.attack = this.character.animations.add('attack', [1, 2, 3 ,1], 5)
    this.attack.onComplete.add(() => this.walk.restart(), this)

    this.character.animations.play('walk')
  }

  initializeTimer () {
    const timer = this.game.time.events
    timer.loop(100, this.keyHandler.bind(this), this)
    timer.start()
  }

  updateExp () {
    console.log('exp inc')
    this.currentExp += 10
    this.currentMana += 10
    this.manabar.destroy()
    this.expbar.destroy()
    this.renderMana()
    this.renderExp()
  }

  updateMana (key) {
    console.log('skill', key)
    this.character.play('attack')

    this.currentMana -= 10
    this.manabar.destroy()
    this.renderMana()
  }

  keyHandler () {
    const keys = this.game.keys
    if (keys.qKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch('q')
    } else if (keys.wKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch('w')
    } else if (keys.eKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch('e')
    } else if (keys.rKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch('r')
    }
  }
}

module.exports = Player
