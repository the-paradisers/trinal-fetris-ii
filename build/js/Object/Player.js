const Phaser = require('phaser-ce')

class Player extends Phaser.Group{

  constructor (game) {
    super(game)

    console.log('game in player', this.game)
    console.log('game world', this.game.world)
    console.log('game width', this.game.world.width)
    console.log('game height', this.game.world.height)
  }

  renderSkills () {
    console.log('renderskills')
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    const manaBar = this.game.add.graphics(0, 0)
    manaBar.beginFill(0xff0000, 1)
    manaBar.drawRoundedRect(gameWidth - 40, gameHeight, 20, 100, 10)
  }


}

module.exports = Player
