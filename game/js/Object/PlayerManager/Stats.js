const Phaser = require('phaser-ce')

class Stats extends Phaser.Group {
  constructor(game) {
    super(game)
    this.playerlvl = 1

    this.maxExpScale = 100
    this.attackPowerScale = 10
    this.spellPowerScale = 10

    this.attackPower = 20
    this.spellPower = 20
    this.healPower = 4

    this.currentMana = 0
    this.currentExp = 0
    this.maxMana = 100
    this.maxExp = 100

    this.spells = this.updateSkillStats()
  }

  playerLevelUp() {
    // increase player level
    this.playerlvl += 1

    this.currentMana = this.maxMana

    // increase amount of exp it takes to level
    this.currentExp = 0
    this.maxExp += this.maxExpScale

    // increase attack and spell power
    this.attackPower += this.attackPowerScale
    this.spellPower += this.spellPowerScale

    this.spells = this.updateSkillStats()

    if (this.playerlvl % 5 === 0 ){
       //switching to next background
      this.game.background[this.game.backgroundIdx].visible = false
      this.game.backgroundIdx += 1
      //reset to first background
      if (this.game.backgroundIdx === 6) this.game.backgroundIdx = 0
      this.game.background[this.game.backgroundIdx].visible = true}
  }

  updateSkillStats() {

    return {
      Q: { name: 'Fire', cost: 35, damage: this.spellPower * 8, acc: 80 },
      W: { name: 'Bolt', cost: 20, damage: this.spellPower * 3, acc: 100 },
      E: { name: 'Ice', cost: 20, damage: this.spellPower * 1.1, acc: 90 },
      R: { name: 'Cure', cost: 40, damage: this.healPower },
    }
  }
}

module.exports = Stats
