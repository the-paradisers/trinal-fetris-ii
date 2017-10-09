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

  takeDamage(damage) {
    this.target.HP -= damage
    const message = `${this.target.name} HP: ${this.target.HP}!`
    this.game.signals.writeLog.dispatch(message)

    if (this.target.HP <= 0) {
      this.die(this.target)
    }
  }

  die(target) {
    this.cursor.destroy()
    // target.visible = false
    this.game.signals.writeLog.dispatch(`You killed ${target.name}!`)
    // for (let i = 0; i < this.children.length; i++) {
    //   if (this.children[i].visible) {
    //     this.target = this.children[i]
    //     this.drawCursor(i)
    //     return
    //   }
    this.remove(target, true)
    this.game.signals.currentEnemies.dispatch(this.children)
    // this.game.signals.writeLog.dispatch(`${target.name} dead!`)
    if (this.children.length) {
      // this.target = this.children[0]
      this.targetEnemy(0)
    } else {
      this.game.signals.endBattle.dispatch()
    }
    // this.game.signals.endBattle.dispatch()
  }

  targetEnemy(keyNum) {
    // Ensures nothing happens when an invalid number is pressed
    // if (enemyIndex >= this.children.length) return
    // Converts enemy's index in enemyGroup to enemy's position on screen
    let enemyPos = -1
    let enemyIndex = -1
    this.children.forEach((enemy, index) => {
      if (keyNum === enemy.pos) {
        enemyPos = enemy.pos
        enemyIndex = index
      }
    })
    if (enemyPos === -1) return

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
