const Battle = require('./Battle')

class BattleManager extends Phaser.Group {
  constructor(game) {
    super(game)

    this.messages = []
    this.battleExp = 50
    this.log = {
      x: 12,
      y: 600,
      style: {
        fill: 'white',
        font: '16pt Arial'
      }
    }

    const enemyData = JSON.parse(this.game.cache.getText('enemies'))
    this.enemyGroup1 = [enemyData['Devil Wolf'], enemyData['Devil Wolf']]
    this.enemyGroup2 = [enemyData['Wild Horn']]
    this.enemyGroup3 = [enemyData['Queen Bee'], enemyData['Queen Bee']]
    this.enemyGroup4 = [enemyData['Stunner'], enemyData['Stunner'], enemyData['Stunner'], enemyData['Stunner']]
    this.enemyGroup5 = [enemyData['Ice Lizard'], enemyData['Ice Lizard'], enemyData['Poison Toad'], enemyData['Poison Toad']]
    this.enemyGroup6 = [enemyData['Helldiver'], enemyData['Helldiver'], enemyData['Helldiver'], enemyData['Wild Horn']]
    this.enemyGroup7 = [enemyData['Stunner'], enemyData['Helldiver'], enemyData['Ice Lizard'], enemyData['Poison Toad']]


    this.battleGroups = [
      this.enemyGroup1,
      this.enemyGroup1,
      this.enemyGroup1,
      this.enemyGroup1,
      this.enemyGroup2,
      this.enemyGroup3,
      this.enemyGroup3,
      this.enemyGroup4,
      this.enemyGroup5,
      this.enemyGroup6,
      this.enemyGroup7,
      this.enemyGroup3,
      this.enemyGroup4,
      this.enemyGroup5,
      this.enemyGroup6,
      this.enemyGroup7,
    ]

  }

  initialize() {
    this.game.signals.writeLog.add(this.writeLog, this)
  }

  startBattle() {
    this.game.inBattle = true
    this.game.moveCount = 0

    this.game.sound.stopAll()
    this.game.battleSong.play()

    this.game.signals.writeLog.dispatch("You've been attacked!")

    //stop walking animation then flip and reposition
    this.game.character.animations.stop()
    this.game.character.scale.x *= -1
    this.game.character.x -= 156

    // randomly select enemy group
    const numberOfGroups = this.battleGroups.length
    const randomIndex = Math.floor(Math.random()*numberOfGroups)


    // Initialize battle and draw enemies
    this.battle = new Battle(this.game, this.battleGroups[randomIndex])
    this.battle.initialize()
    this.battle.children.forEach(enemy => {
      enemy.draw()
    })

    // Add listener to endBattle signal
    this.game.signals.endBattle.add(this.endBattle, this)
  }

  endBattle() {
    this.game.inBattle = false
    this.game.moveCount = 0

    this.game.sound.stopAll()
    this.game.victorySong.play()


    this.game.signals.writeLog.dispatch('You won the battle!')
    this.game.signals.addExp.dispatch(this.battleExp)

    this.game.character.animations.play('victory')
    this.game.character.scale.x *= -1
    this.game.character.x += 156

    this.battle.destroy()
    this.game.signals.hitEnemy.dispose()
    this.game.signals.castFire.dispose()
    this.game.signals.castBolt.dispose()
    this.game.signals.castIce.dispose()
  }

  writeLog(newMessage) {
    // Clear battle log
    if (this.battleLog) {
      this.battleLog.forEach(message => message.destroy())
    }

    // Add new message & delete top message
    this.messages.push(newMessage)
    while (this.messages.length > 5) this.messages.shift()

    // Create text objects for messages
    this.battleLog = this.messages.map((message, i) => {
      return this.game.add.text(this.log.x, this.log.y + (i * 18), message, this.log.style)
    })
  }

}

module.exports = BattleManager
