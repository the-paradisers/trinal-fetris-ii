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
    this.game.signals.currentEnemies.dispatch(this.children)
    console.log(`initialize battle`)
    console.log(this.children)
  }

  initializeSignals() {
    this.game.signals.hitEnemy.add(this.takeDamage, this)
  }

  summonEnemies() {
    // Add enemies in enemyGroup to Battle group
    this.enemyGroup.forEach((enemyData, order) => {
      this.add(new Enemy(this.game, enemyData, this.coords[order]))
    }, this)

    // Set target to 1st child by default
    this.target = this.children[0]
  }

  takeDamage(damage, friendlyfire) {
    if (!friendlyfire){
      this.target.HP -= damage
      const message = `${this.target.name} HP: ${this.target.HP}!`
      this.game.signals.writeLog.dispatch(message)

      if (this.target.HP <= 0) {
        this.die(this.target)
    }
  }
  }

  die(target) {
    this.remove(target, true)
    this.game.signals.currentEnemies.dispatch(this.children)
    this.game.signals.writeLog.dispatch(`${target.name} dead!`)
    if (this.children.length) {
      this.target = this.children[0]
    } else {
      this.game.signals.endBattle.dispatch()
    }
  }
}

module.exports = Battle
