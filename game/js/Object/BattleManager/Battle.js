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
    this.game.signals.hitEnemy.add(this.damageEnemy, this)
    this.game.signals.selectTarget.add(this.targetEnemy, this)
    this.game.signals.castFire.add(this.animateFire, this)
    this.game.signals.castBolt.add(this.animateBolt, this)
    this.game.signals.castIce.add(this.animateIce, this)
    this.game.signals.hitAllEnemies.add(this.damageAllEnemies, this)
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

  damageEnemy(damage, friendlyfire, accuracy) {
    // If this is an enemy block, exit function
    if (friendlyfire) return

    // To determine attack success
    const random = Math.random() * 100
    if (random > accuracy) {
      const missMessage = `Your spell missed ${this.target.name}!`
      this.game.signals.writeLog.dispatch(missMessage)
      return
    }

    const damageModifier = Math.random() * (1.1 - 0.9) + 0.9
    damage = Math.floor(damage * damageModifier)
    console.log(damage)
    this.target.HP -= damage

    const message = `You hit ${this.target.name} for ${damage} damage!`
    this.game.signals.writeLog.dispatch(message)

    if (this.target.HP <= 0) {
      this.die(this.target)
    }
  }

  damageAllEnemies(damage, accuracy) {
    const enemies = this.children
    let index = 0
    while (index < enemies.length) {
      // To determine attack success
      const random = Math.random() * 100
      if (random > accuracy) {
        const missMessage = `Your spell missed ${enemies[index].name}!`
        this.game.signals.writeLog.dispatch(missMessage)
        index++
        continue
      }

      const damageModifier = Math.random() * (1.1 - 0.9) + 0.9
      damage = Math.floor(damage * damageModifier)
      console.log(damage)
      enemies[index].HP -= damage

      const hitMessage = `You hit ${enemies[index].name} for ${damage} damage!`
      this.game.signals.writeLog.dispatch(hitMessage)

      if (enemies[index].HP <= 0) {
        this.die(enemies[index])
      } else {
        index++
      }
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

  animateFire() {
    const fireSprite = this.game.add.sprite(this.target.coords.x, this.target.coords.y, 'fireSprite', 16)
    fireSprite.scale.setTo(2, 2)
    const fireAnimation = fireSprite.animations.add('fireAnimation', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], 24)
    fireAnimation.killOnComplete = true
    fireAnimation.play()
    }

  animateBolt() {
    const boltSprite = this.game.add.sprite(this.target.coords.x, this.target.coords.y, 'boltSprite', 16)
    boltSprite.scale.setTo(2, 2)
    const boltAnimation = boltSprite.animations.add('boltAnimation', null, 24)
    boltAnimation.killOnComplete = true
    boltAnimation.play()
  }

  animateIce() {
    this.children.forEach(enemy => {
      const iceSprite = this.game.add.sprite(enemy.coords.x, enemy.coords.y, 'iceSprite', 16)
      iceSprite.scale.setTo(2, 2)
      const iceAnimation = iceSprite.animations.add('iceAnimation', null, 12)
      iceAnimation.killOnComplete = true
      iceAnimation.play()
    })
  }
}

module.exports = Battle
