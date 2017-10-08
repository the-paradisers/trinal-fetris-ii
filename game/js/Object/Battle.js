// Dimensions vert: 65-720   hori: 1-400

const Enemy = require('./Enemy')

class Battle extends Phaser.Group {
  constructor(game, enemyGroup) {
    super(game)

    this.enemyGroup = enemyGroup
    this.target = {}
    this.messageArr = []

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
    this.write()
    this.initializeSignals()
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
      this.game.signals.logSignal.dispatch('You are victorious!')
    }
  }

  write(newMessage) {
    const x = 10
    const y = 600
    const style = {
      fill: 'white',
      font: '16pt Arial'
    }

    if (this.battleLog) {
      this.battleLog.forEach(message => message.destroy())
    }

    this.messageArr.push(newMessage)
    while (this.messageArr.length > 5) this.messageArr.shift()

    this.battleLog = this.messageArr.map((message, i) => {
      // return this.game.add.bitmapText(
      //   x, y + (i * 18), 'fantasy', message, 16)
      return this.game.add.text(x, y + (i * 18), message, style)
    })
  }

  initializeSignals() {
    const logSignal = new Phaser.Signal()
    logSignal.add(this.write, this)
    this.game.signals.logSignal = logSignal

    this.game.signals.DMGtoMonster = new Phaser.Signal()
    this.game.signals.DMGtoMonster.add(this.takeDamage, this)
  }
}

module.exports = Battle
