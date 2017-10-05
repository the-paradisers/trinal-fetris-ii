// Dimensions vert: 65-720   hori: 1-400

const Enemy = require('./Enemy')

class Battle extends Phaser.Group {
  constructor(game, enemyGroup) {
    super(game)

    this.enemyGroup = enemyGroup
    this.target = {}
    this.coords = [
      {x: 50, y: 90},
      {x: 201, y: 90},
      {x: 50, y: 216},
      {x: 201, y: 216},
    ]

    this.playerAttack = 5
  }

  summonEnemies() {
    this.enemyGroup.forEach((enemyData, order) => {
      this.add(new Enemy(this.game, enemyData, this.coords[order]))
    }, this)

    // Set target to 1st child by default
    this.target = this.children[0]
  }

  setListeners() {
    const rowClearSignal = new Phaser.Signal()
    rowClearSignal.add(this.takeDamage, this)
    this.game.signals.rowClearSignal = rowClearSignal
  }

  takeDamage() {
    this.target.HP -= this.playerAttack
    console.log(`You attacked ${this.target.name}! Its HP is ${this.target.HP}!`)
    if (this.target.HP <= 0) {
      this.die(this.target)
    }
  }

  die(target) {
    this.remove(target, true)
    console.log(`You killed a ${target.name}!`)
  }
}

module.exports = Battle
