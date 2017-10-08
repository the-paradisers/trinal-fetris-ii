/**
 * h: 129-720
 * w: 881-1280
 */

const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)
    //playerlvl = basic dmg
    this.playerlvl = 1
    this.currentMana = 50
    this.maxMana = 150
    this.currentExp = 100
    this.maxExp = 150
    //this.manabar, expbar

    this.skills  = {
      q: { name: 'fire ball', lvl: 0, cost: 5, damage: 1, scale: 1 },
      w: { name: 'lightening', lvl: 0, cost: 5, damage: 2, scale: 2 },
      e: { name: 'icy wind', lvl: 0, cost: 5, damage: 3, scale: 3 },
      r: { name: 'drain life', lvl: 0, cost: 5, damage: 4, scale: 4 },
    }

    this.sectionStartWidth = this.game.world.width * 2 / 3
    this.sectionTotalHeight = this.game.world.height


  }

  initialize () {
    this.game.player = this
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

  renderBar (color, yoffset, measure) {
    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(this.sectionStartWidth+210, 800 - yoffset, measure, 20, 10)
    bar.endFill()

    return bar
  }

  renderLevelText () {
    //rendering not wokring
    // this.lvlText = this.game.add.bitmapText(0, 0, 'fantasy', `LVL ${this.playerlvl}`, 32)
    this.lvlText = this.game.add.text(0, 0, `LVL ${this.playerlvl}`, {fill: 'white'})
    this.lvlText.x = Math.floor(this.sectionStartWidth + 210)
    this.lvlText.y = Math.floor(this.sectionTotalHeight*5/8)
  }

  renderSkills () {
    ['q', 'w', 'e', 'r'].forEach( (key, i) => {
      const skill = this.skills[key]
      // this.game.add.bitmapText(
        // this.sectionStartWidth + 50,
        // 600 + 25*i, 'fantasy',
      //   `${key} - ${skill.name}`, 16)
      this.game.add.text(
        this.sectionStartWidth + 50, 600 + 25*i,
        `${key} - ${skill.name}`, {fill: 'white'})
      const skillButton = this.game.add.button(
        this.sectionStartWidth,
        600 + 25*i, `addSkillPoint`)
      skillButton.onInputDown.add(() => console.log('down'))
      skillButton.onInputUp.add(() => {
        skill.lvl++
        console.log('skilllvl', skill.lvl)})
    })
  }

  initializeSignal () {
    this.game.signals.skillSignal = new Phaser.Signal()
    this.game.signals.skillSignal.add(this.skillCasted, this)

    this.game.signals.manaSignal = new Phaser.Signal()
    this.game.signals.manaSignal.add(this.calculateMana, this)

    this.game.signals.expSignal = new Phaser.Signal()
    this.game.signals.expSignal.add(this.updateExp, this)

  }

  initializePlayerSprite () {
    this.game.character = this.game.add.sprite(this.sectionStartWidth, this.sectionTotalHeight*0.5, 'player')
    this.game.character.scale.setTo(3, 3)
    this.renderLevelText()

    this.walk = this.game.character.animations.add('walk', [1, 0], 4, true)

    this.attack = this.game.character.animations.add('attack', [1, 2, 3 ,1], 5)
    this.attack.onComplete.add(() => this.walk.restart(), this)

    this.game.character.animations.play('walk')
  }

  updateExp (exp) {
    this.game.signals.logSignal.dispatch(`${exp} exp gained`)
    this.currentExp += exp
    if (this.currentExp >= this.maxExp) {
      this.currentExp = 0
      this.playerlvl++
      this.updateSkillDamage()
      this.lvlText.destroy()
      this.renderLevelText()
    }

    this.expbar.destroy()
    this.renderExp()
  }

  updateSkillDamage () {
    for (let key in this.skills){
      this.skills[key].damage += this.skills[key].scale
    }
  }

  updateMana (mana) {
    if (this.currentMana + mana > 0){
      this.currentMana += mana
      if (this.currentMana > this.maxMana) this.currentMana = this.maxMana
    } else {
      this.game.signals.logSignal.dispatch('out of mana')
    }
    this.manabar.destroy()
    this.renderMana()
  }

  calculateMana (numLinesCleared) {
    if (numLinesCleared > 0) {
      this.updateMana(Math.pow(2, numLinesCleared - 1) * 10)
    }
  }

  skillCasted (key) {
    //Damage to an enemy
    this.game.signals.logSignal.dispatch(`${this.skills[key].name} casted`)

    let mana
    switch(key) {
      case 'q':
        mana = this.skills.q.cost
        break;
      case 'w':
        mana = this.skills.w.cost
        break;
      case 'e':
        mana = this.skills.e.cost
        break;
      case 'r':
        mana = this.skills.r.cost
        break;
    }

    if (this.currentMana - mana > 0){
      this.game.character.play('attack')
      this.game.signals.DMGtoMonster.dispatch(this.skills[key].damage)
    }
    this.updateMana(-1 * mana)
  }
}

module.exports = Player
