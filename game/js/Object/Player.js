/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    this.currentMana = 150
    //this.manabar
  }

  initialize () {
    this.initializeMana()
    this.initializeSignal()
    this.initializeTimer()
  }

  initializeMana () {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    const manabar = this.game.add.graphics(0, 0)
    manabar.beginFill(0x00d1ff, 1)
    manabar.drawRoundedRect(gameWidth - gameWidth/3, gameHeight-50, this.currentMana, 20, 10)
    manabar.endFill()

    this.manabar = manabar
  }

  initializeSignal () {
    const skillSignal = new Phaser.Signal();
    skillSignal.add(this.updateMana, this)
    this.game.skillSignal = skillSignal
  }

  initializeTimer () {
    const timer = this.game.time.events
    timer.loop(100, this.keyHandler.bind(this), this)
    timer.start()
  }

  updateMana (key) {
    console.log('skill', key)
    this.currentMana -= 10
    this.manabar.destroy()
    this.initializeMana()
  }

  keyHandler () {
    const keys = this.game.keys
    if (keys.qKey.isDown) {
      this.game.skillSignal.dispatch('q')
    } else if (keys.wKey.isDown) {
      this.game.skillSignal.dispatch('w')
    } else if (keys.eKey.isDown) {
      this.game.skillSignal.dispatch('e')
    } else if (keys.rKey.isDown) {
      this.game.skillSignal.dispatch('r')
    }
  }
}

module.exports = Player
