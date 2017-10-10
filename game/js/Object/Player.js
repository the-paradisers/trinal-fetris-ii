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

    this.cureLevel = 1
    this.spells  = {
      Q: { name: 'Fire', lvl: 0, cost: 5, damage: 1, scale: 1 },
      W: { name: 'Bolt', lvl: 0, cost: 5, damage: 2, scale: 2 },
      E: { name: 'Ice', lvl: 0, cost: 5, damage: 3, scale: 3 },
      R: { name: 'Cure', lvl: 0, cost: 5, damage: this.cureLevel, scale: 4 },
    }

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

  renderSpells() {
    ['Q', 'W', 'E', 'R'].forEach( (key, i) => {
      const spell = this.spells[key]
      // this.game.add.bitmapText(
        // this.sectionStartWidth + 50,
        // 600 + 25*i, 'fantasy',
      //   `${key} - ${spell.name}`, 16)
      this.game.add.text(
        this.sectionStartWidth + 50, 600 + 25 * i,
        `${key} - ${spell.name}`, {fill: 'white'})
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
      this.updateSpellDamage()
      this.lvlText.destroy()
      this.renderLevelText()
    }

    this.expbar.destroy()
    this.renderExp()
  }

  updateSpellDamage() {
    for (let key in this.spells){
      this.spells[key].damage += this.spells[key].scale
    }
  }

  updateMana(mana) {
    if (this.currentMana + mana > 0){
      this.currentMana += mana
      if (this.currentMana > this.maxMana) this.currentMana = this.maxMana
    } else {
      this.currentMana = 0
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
    const spell = this.spells[key]

    // Ensure player has enough mana to cast spell
    if (this.currentMana < spell.cost) return this.game.signals.writeLog.dispatch("You don't have enough mana!")

    // Play animation, consume mana, and log message
    this.game.character.play('attack')
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
    this.game.signals.hitEnemy.dispatch(fireData.damage, false)
  }

  castBolt(boltData) {
    this.game.signals.hitEnemy.dispatch(boltData.damage, false)
  }

  castIce(iceData) {
    this.game.signals.hitEnemy.dispatch(iceData.damage, false)
  }

  castCure(cureData) {
    this.game.clearBottomRows(cureData.damage)
  }

}

module.exports = Player
