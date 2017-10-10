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
  }

  initialize() {
    this.initializeSignals()
    this.summonEnemies()
    this.game.signals.currentEnemies.dispatch(this.children)
  }

  initializeSignals() {
    this.game.signals.hitEnemy.add(this.takeDamage, this)
    this.game.signals.selectTarget.add(this.targetEnemy, this)
  }

  summonEnemies() {
    // Add enemies in enemyGroup to Battle group
    this.enemyGroup.forEach((enemyData, enemyIndex) => {
      this.add(new Enemy(this.game, enemyData, this.coords[enemyIndex], enemyIndex))
    }, this)

    // Set target to 1st child by default
    this.drawCursor(0)
    this.targetEnemy(0)
  }

  takeDamage(damage, friendlyfire) {
    // If this is an enemy block, exit function
    if (friendlyfire) return

    this.target.HP -= damage

    // Ensure HP is never negative
    if (this.target.HP < 0) this.target.HP = 0

    const message = `${this.target.name} HP: ${this.target.HP}!`
    this.game.signals.writeLog.dispatch(message)

    if (this.target.HP === 0) {
      this.die(this.target)
    }
  }

  die(target) {
    this.cursor.destroy()
    this.game.signals.writeLog.dispatch(`You killed ${target.name}!`)
    this.remove(target, true)
    this.game.signals.currentEnemies.dispatch(this.children)
    if (this.children.length) {
      // Intentionally invoke with no arg
      this.targetEnemy()
    } else {
      this.game.signals.endBattle.dispatch()
    }
  }

  targetEnemy(enemyPos) {
    // enemyIndex is its position in the enemyGroup array
    // enemyPosition is its original position on screen (so the target keys 1-4 are consistent)
    let enemyIndex = -1
    this.children.forEach((enemy, index) => {
      // When trying to auto target after killing enemy, set enemyPos to first available
      if (enemyPos === undefined) enemyPos = enemy.pos
      // When trying to manually target, ensure enemy is there
      if (enemyPos === enemy.pos) enemyIndex = index
    })
    // If there is no enemy at that position, exit function
    if (enemyIndex === -1) return

    this.cursor.destroy()
    this.target = this.children[enemyIndex]
    this.drawCursor(enemyPos)
  }

  drawCursor(enemyPos) {
    this.cursor = this.game.add.image(this.coords[enemyPos].x, this.coords[enemyPos].y, 'cursor')
    this.cursor.scale.setTo(2, 2)
  }
}

module.exports = Battle
