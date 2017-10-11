const Phaser = require('phaser-ce')

class Stats extends Phaser.Group {
  constructor(game) {
    super(game)
    this.playerlvl = 1

    this.maxManaScale = 100
    this.maxExpScale = 100
    this.attackPowerScale = 10
    this.spellPowerScale = 10

    this.currentMana = 100
    this.currentExp = 0
    this.maxMana = 100
    this.maxExp = 100
    // this.maxAttackPower = 990
    // this.maxSpellPower = 990

    this.spells = this.updateSkillStats()
  }

  playerLevelUp() {
    this.playerlvl += 1
    this.game.playerlvl = this.playerlvl
    this.maxMana = this.playerlvl * this.maxManaScale
    this.maxExp = this.maxExpScale
    // this.maxExp = this.playerlvl * this.maxExpScale
    this.spells = this.updateSkillStats()

    //switching to next background
    this.game.background[this.game.backgroundIdx].visible = false
    this.game.backgroundIdx += 1
    //reset to first background
    if (this.game.backgroundIdx === 6) this.game.backgroundIdx = 0
    this.game.background[this.game.backgroundIdx].visible = true
  }

  updateSkillStats() {
    const manaCost = 10
    const healLevel = 2
    const attackDamage = this.playerlvl * this.attackPowerScale
    const spellDamage = this.playerlvl * this.spellPowerScale

    return {
      Q: { name: 'Fire', cost: 20, damage: spellDamage },
      W: { name: 'Bolt', cost: 20, damage: spellDamage },
      E: { name: 'Ice', cost: 20, damage: spellDamage },
      R: { name: 'Cure', cost: 20, damage: healLevel },
    }
  }
}

module.exports = Stats
