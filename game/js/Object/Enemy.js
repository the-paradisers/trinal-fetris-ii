class Enemy extends Phaser.Group {
  constructor(game, data, coords) {
    super(game)

    this.game = game
    this.frame = data.frame
    this.name = data.name
    this.level = data.level
    this.HP = data.HP
    this.coords = coords
  }

  draw() {
    const x = this.coords.x
    const y = this.coords.y
    const enemyHeight = 100
    const style = {
      fill: 'white',
      font: '14pt Arial'
    }

    this.create(x, y, 'enemy-animals', this.frame)
    this.game.add.text(x, y + enemyHeight, this.name, style)
  }
}

module.exports = Enemy
