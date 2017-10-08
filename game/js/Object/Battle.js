// Dimensions vert: 65-720   hori: 1-400

const Enemy = require('./Enemy')

class Battle extends Phaser.Group {
  constructor(game, enemyGroup) {
    super(game)

    this.enemyGroup = enemyGroup
    this.target = {}

    // Enemy sprite offsets
    this.coords = [
      {x: 16, y: 128},
      {x: 232, y: 128},
      {x: 16, y: 344},
      {x: 232, y: 344},
    ]

    this.playerAttack = 5
  }

  initialize() {
    this.initializeSignals()
    this.summonEnemies()
  }

  summonEnemies() {
    // Add enemies in enemyGroup to Battle group
    this.enemyGroup.forEach((enemyData, order) => {
      this.add(new Enemy(this.game, enemyData, this.coords[order]))
    }, this)

    // Set target to 1st child by default
    this.target = this.children[0]
  }

  takeDamage(damage) {
    this.target.HP -= damage
    const message = `${this.target.name} HP: ${this.target.HP}!`
    this.game.signals.logSignal.dispatch(message)

    if (this.target.HP <= 0) {
      this.die(this.target)
    }
  }

  die(target) {
    this.remove(target, true)
    this.game.signals.logSignal.dispatch(`${target.name} dead!`)
    if (this.children.length) {
      this.target = this.children[0]
    } else {
      this.game.signals.endBattle.dispatch()
    }
  }

  initializeSignals() {
    this.game.signals.DMGtoMonster = new Phaser.Signal()
    this.game.signals.DMGtoMonster.add(this.takeDamage, this)
  }
}

module.exports = Battle
