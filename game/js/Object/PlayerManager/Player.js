const Phaser = require('phaser-ce')
const Stats = require('./Stats')

class Player extends Phaser.Group{

  constructor(game) {
    super(game)
    this.stats = new Stats(this.game)
    this.game.playerStats = this.stats

    this.sectionStartWidth = this.game.world.width * 2 / 3
    this.sectionTotalHeight = this.game.world.height
  }

  initialize() {
    this.game.player = this
    this.renderMana()
    this.renderExp()
    this.renderSpells()
    this.initializeSignal()
    this.initializePlayerSprite()
  }

  renderMana() {
    const yOffSet = this.sectionTotalHeight * 0.5 - 75
    const barWidth = this.stats.currentMana / this.stats.maxMana * 200
    this.manabar = this.renderBar(0x00d1ff, yOffSet - 25, barWidth)
  }

  renderExp() {
    const yOffSet = this.sectionTotalHeight * 0.5 - 75
    const barWidth = this.stats.currentExp / this.stats.maxExp * 200
    this.expbar = this.renderBar(0xffff00, yOffSet, barWidth)
  }

  renderBar(color, yOffSet, measure) {
    const bar = this.game.add.graphics(0, 0)
    bar.beginFill(color, 1)
    bar.drawRoundedRect(this.sectionStartWidth + 210, 800 - yOffSet, measure, 20, 10)
    bar.endFill()

    return bar
  }

  renderLevelText() {
    this.lvlText = this.game.add.text(0, 0, `LVL ${this.stats.playerlvl}`, {fill: 'white'})
    this.lvlText.x = Math.floor(this.sectionStartWidth + 210)
    this.lvlText.y = Math.floor(this.sectionTotalHeight * 5 / 8)
  }

  renderSpells() {
    ['Q', 'W', 'E', 'R'].forEach( (key, i) => {
      const spell = this.stats.spells[key]
      this.game.add.text(
        this.sectionStartWidth + 50, 600 + 25 * i,
        `${key}: ${spell.name}`, {fill: 'gold'})
    })
  }

  initializeSignal() {
    this.game.signals.castSpell.add(this.spellRouter, this)
    this.game.signals.addMana.add(this.calculateMana, this)
    this.game.signals.addExp.add(this.updateExp, this)
  }

  initializePlayerSprite() {
    this.game.character = this.game.add.sprite(this.sectionStartWidth, this.sectionTotalHeight * 0.5, 'player')
    this.game.character.scale.setTo(3, 3)
    this.renderLevelText()

    this.walk = this.game.character.animations.add('walk', [0, 1], 4, true)

    this.victory = this.game.character.animations.add('victory', [0, 4, 0, 4, 0, 4], 3)
    this.victory.onComplete.add(() => {
      this.walk.play()
      }, this)

    this.attack = this.game.character.animations.add('attack', [1, 2, 3, 1], 4)

    this.game.character.animations.play('walk')
    this.game.character.scale.x *= -1
    this.game.character.x += 156
  }

  updateExp(exp) {
    this.game.signals.writeLog.dispatch(`You gained ${exp} EXP!`)
    this.stats.currentExp += exp
    if (this.stats.currentExp >= this.stats.maxExp) {
      this.stats.currentExp = 0
      this.stats.playerLevelUp()
      this.lvlText.destroy()
      this.renderLevelText()
    }

    this.expbar.destroy()
    this.renderExp()
  }

  updateMana(mana) {
    if (this.stats.currentMana + mana > 0){
      this.stats.currentMana += mana
      if (this.stats.currentMana > this.stats.maxMana) this.stats.currentMana = this.stats.maxMana
    } else {
      this.stats.currentMana = 0
      // this.game.signals.writeLog.dispatch("You're out of mana.")
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

  spellRouter(key) {
    const spell = this.stats.spells[key]

    // Ensure player has enough mana to cast spell
    if (this.stats.currentMana < spell.cost) return this.game.signals.writeLog.dispatch("You don't have enough mana!")

    // Play animation, consume mana, and log message
    if (this.game.inBattle) {
      this.game.character.play('attack')
    } else {
      if (!this.victory.isPlaying) this.game.character.play('walk')
    }
    this.updateMana(-spell.cost)
    this.game.signals.writeLog.dispatch(`You cast ${spell.name}!`)

    // Route to proper spell method
    switch (spell.name) {
      case 'Fire':
        this.castFire(spell)
        break
      case 'Bolt':
        this.castBolt(spell)
        break
      case 'Ice':
        this.castIce(spell)
        break
      case 'Cure':
        this.castCure(spell)
        break
      default:
        throw new Error('Invalid Spell Input')
    }

    // Eat block
    const tetris = this.game.state.states.Game.tetris
    tetris.block.group.removeAll()
    tetris.block.getNextBlock()
    tetris.draw()
  }

  castFire(fireData) {
    this.game.sounds.fire.play()
    this.game.signals.castFire.dispatch()
    this.game.signals.hitEnemy.dispatch(fireData.damage, false, fireData.acc)
    this.game.changeBoardColor(5)
  }

  castBolt(boltData) {
    this.game.sounds.bolt.play()
    this.game.signals.castBolt.dispatch()
    this.game.signals.hitEnemy.dispatch(boltData.damage, false)
    this.game.changeBoardColor(6)
  }

  castIce(iceData) {
    this.game.sounds.ice.play()
    this.game.signals.castIce.dispatch()
    this.game.signals.hitAllEnemies.dispatch(iceData.damage, iceData.acc)
    this.game.changeBoardColor(4)
  }

  castCure(cureData) {
    this.game.signals.castCure.dispatch()
    this.game.clearBottomRows(cureData.damage)
    this.game.changeBoardColor(3)
  }

}

module.exports = Player
