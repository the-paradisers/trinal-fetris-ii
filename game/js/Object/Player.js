/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    this.playerlvl = 1
    this.currentMana = 150
    this.maxMana = 300
    this.currentExp = 50
    this.maxExp = 300
    //this.manabar, expbar
  }

  initialize () {
    this.renderMana()
    this.renderExp()
    this.initializeSignal()
    this.initializePlayerSprite()
    this.initializeTimer()
  }

  renderMana () {
    this.manabar = this.renderBar(0x00d1ff, 50, this.currentMana)
  }

  renderExp () {
    this.expbar = this.renderBar(0xffff00, 75, this.currentExp)
  }

  renderLevelText () {
    this.lvlText = this.game.add.text(0, 0, `LVL ${this.playerlvl}`, {fill: 'white'})
    this.lvlText.x = Math.floor(this.character.x + 75)
    this.lvlText.y = Math.floor(this.character.y)
  }

  renderBar (color, yoffset, measure) {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(gameWidth - gameWidth/3, gameHeight-yoffset, measure, 20, 10)
    bar.endFill()

    return bar
  }

  initializeSignal () {
    const skillSignal = new Phaser.Signal()
    skillSignal.add(this.skillCasted, this)

    const lineClearSignal = new Phaser.Signal()
    lineClearSignal.add(this.lineClearSignal, this)

    const expSignal = new Phaser.Signal()
    expSignal.add(this.updateExp, this)

    this.game.playerSignal = {
      skillSignal,
      lineClearSignal,
      expSignal,
    }
  }

  initializePlayerSprite () {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.character = this.game.add.sprite(gameWidth - gameWidth/3, gameHeight-150, 'player')
    this.renderLevelText()

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

  updateExp (exp) {
    console.log('exp inc', exp)
    this.currentExp += exp
    if (this.currentExp >= this.maxExp) {
      this.currentExp = 0
      this.playerlvl++
      this.lvlText.destroy()
      this.renderLevelText()
    }

    this.expbar.destroy()
    this.renderExp()
  }

  updateMana (mana) {
    console.log('mana change', mana)
    if (this.currentMana + mana > 0){
      this.currentMana += mana
      if (this.currentMana > this.maxMana) this.currentMana = this.maxMana
    } else {
      console.log('out of mana')
    }
    this.manabar.destroy()
    this.renderMana()
  }

  lineClearSignal (numLinesCleared) {
    if (numLinesCleared > 0) {
      this.updateMana(Math.pow(2, numLinesCleared - 1) * 10)
    }

    //testing exp
    this.updateExp(150)
  }

  skillCasted (mana) {
    //Damage to an enemy

    this.character.play('attack')
    this.updateMana(-1 * mana)
  }

  keyHandler () {
    const keys = this.game.keys
    if (keys.qKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch(10)
    } else if (keys.wKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch(20)
    } else if (keys.eKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch(30)
    } else if (keys.rKey.isDown) {
      this.game.playerSignal.skillSignal.dispatch(40)
    }
  }
}

module.exports = Player
