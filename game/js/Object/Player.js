/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    this.playerlvl = 1
    this.currentMana = 50
    this.maxMana = 150
    this.currentExp = 50
    this.maxExp = 150
    //this.manabar, expbar

    this.skills  = {
      q: { name: 'fire ball', lvl: 0, cost: 10, damage: 5 * this.playerlvl },
      w: { name: 'lightening', lvl: 0, cost: 20, damage: 5 * this.playerlvl },
      e: { name: 'icy wind', lvl: 0, cost: 30, damage: 5 * this.playerlvl },
      r: { name: 'drain life', lvl: 0, cost: 40, damage: 5 * this.playerlvl },
    }

    this.sectionStartWidth = this.game.world.width * 2 / 3
    this.sectionTotalHeight = this.game.world.height


  }

  initialize () {
    this.renderMana()
    this.renderExp()
    this.renderSkills()
    this.initializeSignal()
    this.initializePlayerSprite()
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
    const currentlvl = 'LVL ' + this.playerlvl.toString()
    this.lvlText = this.game.add.bitmapText(0, 0, 'fantasy', currentlvl, 32)
    this.lvlText.x = Math.floor(this.sectionStartWidth + 210)
    this.lvlText.y = Math.floor(this.sectionTotalHeight*5/8)
  }

  renderBar (color, yoffset, measure) {
    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(this.sectionStartWidth+210, 800 - yoffset, measure, 20, 10)
    bar.endFill()

    return bar
  }

  renderSkills () {
    ['q', 'w', 'e', 'r'].forEach( (key, i) => {
      const skill = this.skills[key]
      this.game.add.bitmapText(
        this.sectionStartWidth + 50,
        600 + 25*i, 'fantasy',
        `${key} - ${skill.name}`, 16)
      // const skillButton = this.game.add.button(
      //   this.sectionStartWidth,
      //   600 + 25*i, `${key}Button`)
      // skillButton.onInputDown.add(() => console.log('down'))
      // skillButton.onInputUp.add(() => {
      //   skill.lvl++
      //   console.log('skilllvl', skill.lvl)})
    })
  }

  initializeSignal () {
    this.game.signals.skillSignal = new Phaser.Signal()
    this.game.signals.skillSignal.add(this.skillCasted, this)

    this.game.signals.increaseMana = new Phaser.Signal()
    this.game.signals.increaseMana.add(this.lineClearSignal, this)

    this.game.signals.expSignal = new Phaser.Signal()
    this.game.signals.expSignal.add(this.updateExp, this)

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

  updateExp (exp) {
    this.game.signals.logSignal.dispatch(`${exp} exp gained`)
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
      this.game.signals.logSignal.dispatch('OUT OF MANA')
    }
    this.manabar.destroy()
    this.renderMana()
  }

  lineClearSignal (numLinesCleared) {
    if (numLinesCleared > 0) {
      this.updateMana(Math.pow(2, numLinesCleared - 1) * 10)
    }

    //testing exp
    // this.updateExp(10)
  }

  skillCasted (key) {
    //Damage to an enemy
    this.game.signals.logSignal.dispatch(`${key} casted`)
    this.game.signals.basicDMGtoMonster.dispatch()

    let mana
    switch(key) {
      case 'q':
        mana = 10
        break;
      case 'w':
        mana = 20
        break;
      case 'e':
        mana = 30
        break;
      case 'r':
        mana = 40
        break;
    }

    this.character.play('attack')
    this.updateMana(-1 * mana)
  }
}

module.exports = Player
