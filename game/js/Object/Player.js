/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    console.log(this)
    this.keys = keys
    this.playerlvl = 1
    this.currentMana = 50
    this.maxMana = 150
    this.currentExp = 50
    this.maxExp = 150
    //this.manabar, expbar

    this.sectionStartWidth = this.game.world.width * 2 / 3
    this.sectionTotalHeight = this.game.world.height


  }

  initialize () {
    this.renderMana()
    this.renderExp()
    this.renderSkills()
    this.initializeSignal()
    this.initializePlayerSprite()
    this.initializeTimer()
  }

  renderMana () {
    const yoffset = this.sectionTotalHeight*0.5 - 75
    this.manabar = this.renderBar(0x00d1ff, yoffset-25, this.currentMana)
  }

  renderExp () {
    const yoffset = this.sectionTotalHeight*0.5 - 75
    this.expbar = this.renderBar(0xffff00, yoffset, this.currentExp)
  }

  renderLevelText () {
    this.lvlText = this.game.add.text(0, 0, `LVL ${this.playerlvl}`, {fill: 'white'})
    this.lvlText.x = Math.floor(this.sectionStartWidth + 200)
    this.lvlText.y = Math.floor(this.character.y)
  }

  renderBar (color, yoffset, measure) {
    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(this.sectionStartWidth+200, this.sectionTotalHeight-yoffset, measure, 20, 10)
    bar.endFill()

    return bar
  }

  renderSkills () {
    this.game.add.text(
      this.sectionStartWidth,
      this.sectionTotalHeight*3/4,
      'Q - FIRE BALL', {fill: 'white'})
    this.game.add.text(
      this.sectionStartWidth,
      this.sectionTotalHeight*3/4+30,
      'W - LIGHTENING', {fill: 'white'})
    this.game.add.text(
      this.sectionStartWidth,
      this.sectionTotalHeight*3/4+60,
      'E - ICY WIND', {fill: 'white'})
    this.game.add.text(
      this.sectionStartWidth,
      this.sectionTotalHeight*3/4+90,
      'R - DRAIN LIFE', {fill: 'white'})
  }

  initializeSignal () {
    this.game.signals.skillSignal = new Phaser.Signal()
    this.game.signals.skillSignal.add(this.skillCasted, this)

    this.game.signals.lineClearSignal = new Phaser.Signal()
    this.game.signals.lineClearSignal.add(this.lineClearSignal, this)

    this.game.signals.expSignal = new Phaser.Signal()
    this.game.signals.expSignal.add(this.updateExp, this)

    // this.game.playerSignal = {
    //   skillSignal,
    //   lineClearSignal,
    //   expSignal,
    // }
  }

  initializePlayerSprite () {
    this.character = this.game.add.sprite(this.sectionStartWidth, this.sectionTotalHeight*0.5, 'player')
    this.character.scale.setTo(3, 3)
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
    this.updateExp(10)
  }

  skillCasted (mana) {
    //Damage to an enemy

    this.character.play('attack')
    this.updateMana(-1 * mana)
  }

  keyHandler () {
    if (this.keys.qKey.isDown) {
      this.game.signals.skillSignal.dispatch(10)
    } else if (this.keys.wKey.isDown) {
      this.game.signals.skillSignal.dispatch(20)
    } else if (this.keys.eKey.isDown) {
      this.game.signals.skillSignal.dispatch(30)
    } else if (this.keys.rKey.isDown) {
      this.game.signals.skillSignal.dispatch(40)
    }
  }
}

module.exports = Player
