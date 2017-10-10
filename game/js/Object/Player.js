const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor(game) {
    super(game)
    //player basic dmg is equal to player's level
    this.playerlvl = 1
    this.currentMana = 50
    this.maxMana = 150
    this.currentExp = 100
    this.maxExp = 150

    this.healSkillLevel = 1
    this.skills  = {
      Q: { name: 'Fire Ball', lvl: 0, cost: 5, damage: 1, scale: 1 },
      W: { name: 'Lightning', lvl: 0, cost: 5, damage: 2, scale: 2 },
      E: { name: 'Icy Wind', lvl: 0, cost: 5, damage: 3, scale: 3 },
      R: { name: 'Heal', lvl: 0, cost: 5, damage: this.healSkillLevel, scale: 4 },
    }

    this.sectionStartWidth = this.game.world.width * 2 / 3
    this.sectionTotalHeight = this.game.world.height
  }

  initialize() {
    this.game.player = this
    this.renderMana()
    this.renderExp()
    this.renderSkills()
    this.initializeSignal()
    this.initializePlayerSprite()
  }

  renderMana() {
    const yOffSet = this.sectionTotalHeight * 0.5 - 75
    this.manabar = this.renderBar(0x00d1ff, yOffSet - 25, this.currentMana)
  }

  renderExp() {
    const yOffSet = this.sectionTotalHeight * 0.5 - 75
    this.expbar = this.renderBar(0xffff00, yOffSet, this.currentExp)
  }

  renderBar(color, yOffSet, measure) {
    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(this.sectionStartWidth + 210, 800 - yOffSet, measure, 20, 10)
    bar.endFill()

    return bar
  }

  renderLevelText() {
    // final fantasy font (numbers & symbols) is not rendering
    // this.lvlText = this.game.add.bitmapText(0, 0, 'fantasy', `LVL ${this.playerlvl}`, 32)
    this.lvlText = this.game.add.text(0, 0, `LVL ${this.playerlvl}`, {fill: 'white'})
    this.lvlText.x = Math.floor(this.sectionStartWidth + 210)
    this.lvlText.y = Math.floor(this.sectionTotalHeight * 5 / 8)
  }

  renderSkills() {
    ['Q', 'W', 'E', 'R'].forEach( (key, i) => {
      const skill = this.skills[key]
      // this.game.add.bitmapText(
        // this.sectionStartWidth + 50,
        // 600 + 25*i, 'fantasy',
      //   `${key} - ${skill.name}`, 16)
      this.game.add.text(
        this.sectionStartWidth + 50, 600 + 25 * i,
        `${key} - ${skill.name}`, {fill: 'white'})
    })
  }

  initializeSignal() {
    this.game.signals.castSpell.add(this.castSpell, this)
    this.game.signals.addMana.add(this.calculateMana, this)
    this.game.signals.addExp.add(this.updateExp, this)
  }

  initializePlayerSprite() {
    this.game.character = this.game.add.sprite(this.sectionStartWidth, this.sectionTotalHeight * 0.5, 'player')
    this.game.character.scale.setTo(3, 3)
    this.renderLevelText()

    this.walk = this.game.character.animations.add('walk', [0, 1], 4, true)

    this.victory = this.game.character.animations.add('victory', [0, 4, 0, 4, 0, 4], 3)
    this.victory.onComplete.add(() => this.walk.play(), this)

    this.attack = this.game.character.animations.add('attack', [1, 2, 3, 1], 4)

    this.game.character.animations.play('walk')
  }

  updateExp(exp) {
    this.game.signals.writeLog.dispatch(`You gained ${exp} EXP!`)
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

  updateSkillDamage() {
    for (let key in this.skills){
      this.skills[key].damage += this.skills[key].scale
    }
  }

  updateMana(mana) {
    if (this.currentMana + mana > 0){
      this.currentMana += mana
      if (this.currentMana > this.maxMana) this.currentMana = this.maxMana
    } else {
      this.game.signals.writeLog.dispatch("You're out of mana.")
    }
    this.manabar.destroy()
    this.renderMana()
  }

  calculateMana(numLinesCleared) {
    if (numLinesCleared > 0) {
      const manaToAdd = Math.pow(2, numLinesCleared - 1) * 10
      this.updateMana(manaToAdd)
    }
  }

  // Change method name and signal listener
  castSpell(key) {
    // const manaCost = this.skills[key].cost
    // if (this.currentMana < manaCost) return this.game.signals.writeLog.dispatch("You don't have enough mana!")

    let mana
    let heal = false
    switch (key) {
      case 'Q':
        mana = this.skills.Q.cost
        break
      case 'W':
        mana = this.skills.W.cost
        break
      case 'E':
        mana = this.skills.E.cost
        break
      case 'R':
        mana = this.skills.R.cost
        heal = true
        break
        // return this.castHeal()
      default:
        throw new Error('Invalid Skill Input')
    }

    if (this.currentMana - mana > 0){
      this.game.character.play('attack')
      this.game.signals.writeLog.dispatch(`You cast ${this.skills[key].name}!`)
      if (heal) {
        this.game.clearBottomRows(this.skills.Q.damage)
      } else {
        this.game.signals.hitEnemy.dispatch(this.skills[key].damage, false)
      }


      const tetris = this.game.state.states.Game.tetris
      tetris.block.group.removeAll()
      tetris.block.getNextBlock()
      tetris.draw()

      this.updateMana(-1 * mana)
    }
  }

  castHeal() {

  }
}

module.exports = Player
