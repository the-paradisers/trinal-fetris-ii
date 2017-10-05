// Dimensions vert: 65-720   hori: 1-400

const Enemy = require('./Enemy')

class Battle extends Phaser.Group {
  constructor(game, enemyGroup) {
    super(game)

    this.game = game
    this.enemyGroup = enemyGroup
    this.coords = [
      {x: 50, y: 90},
      {x: 201, y: 90},
      {x: 50, y: 216},
      {x: 201, y: 216},
    ]
  }

  summonEnemies() {
    this.enemyGroup.forEach((enemyData, order) => {
      console.log('this.game in summonEnemies', this.game)
      this.add(new Enemy(this.game, enemyData, this.coords[order]))
    })
  }
}

module.exports = Battle
