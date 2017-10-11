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

    // Temporary data
    const enemyData1 = {
      frame: 0,
      name: 'Werewolf',
      level: 1,
      HP: 20,
    }
    const enemyData2 = {
      frame: 1,
      name: 'Devil Wolf',
      level: 1,
      HP: 15,
    }
    const enemyData3 = {
      frame: 2,
      name: 'Werepanther',
      level: 1,
      HP: 30,
    }
    this.enemyGroup = [enemyData1, enemyData2, enemyData3]
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
    this.game.character.animations.stop(true)

    // Initialize battle and draw enemies
    this.battle = new Battle(this.game, this.enemyGroup)
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

    this.battle.destroy()
    this.game.signals.hitEnemy.dispose()
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
