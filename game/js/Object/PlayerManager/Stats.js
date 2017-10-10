const Phaser = require('phaser-ce')

class Stats extends Phaser.Group {
  constructor(game) {
    super(game)
    this.playerlvl = 1

    this.maxManaScale = 100
    this.maxExpScale = 100
    this.attackPowerScale = 10
    this.spellPowerScale = 10

    this.maxMana = 100
    this.maxExp = 100
    // this.maxAttackPower = 990
    // this.maxSpellPower = 990

    this.skills = this.updateSkillStats()
  }

  playerLevelUp() {
    this.playerlvl += 1
    this.game.playerlvl = this.playerlvl
    this.maxMana = this.playerlvl * this.maxManaScale
    this.maxExp = this.playerlvl * this.maxExpScale
    this.skills = this.updateSkillStats()
  }

  updateSkillStats() {
    const manaCost = this.playerlvl * 10
    const attackDamage = this.playerlvl * this.attackPowerScale
    const spellDamage = this.playerlvl * this.spellPowerScale

    return {
      Q: { name: 'Heal', cost: manaCost, damage: spellDamage },
      W: { name: 'Lightning', cost: manaCost, damage: spellDamage },
      E: { name: 'Icy Wind', cost: manaCost, damage: spellDamage },
      R: { name: 'Drain Life', cost: manaCost, damage: spellDamage },
    }
  }
}

module.exports = Stats
