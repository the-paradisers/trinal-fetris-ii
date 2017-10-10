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
    this.maxExp = this.playerlvl * this.maxExpScale
    this.spells = this.updateSkillStats()
  }

  updateSkillStats() {
    const manaCost = this.playerlvl * 10
    const attackDamage = this.playerlvl * this.attackPowerScale
    const spellDamage = this.playerlvl * this.spellPowerScale

    return {
      Q: { name: 'Fire', cost: manaCost, damage: spellDamage },
      W: { name: 'Bolt', cost: manaCost, damage: spellDamage },
      E: { name: 'Ice', cost: manaCost, damage: spellDamage },
      R: { name: 'Cure', cost: manaCost, damage: this.playerlvl },
    }
  }
}

module.exports = Stats
