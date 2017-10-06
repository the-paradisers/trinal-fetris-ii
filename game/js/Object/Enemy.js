class Enemy extends Phaser.Group {
  constructor(game, data, coords) {
    super(game)

    this.frame = data.frame
    this.name = data.name
    this.level = data.level
    this.HP = data.HP
    this.coords = coords

    console.log(this.name, 'HP:', this.HP)
  }

  draw() {
    const x = this.coords.x
    const y = this.coords.y
    const enemyHeight = 130
    const style = {
      fill: 'white',
      font: '14pt Arial'
    }

    // Draw sprite
    const enemySprite = this.create(x, y, 'enemy-animals', this.frame)
    enemySprite.scale.setTo(2, 2)

    // Draw name
    const nameplate = new Phaser.Text(this.game, x, y + enemyHeight, this.name.toUpperCase(), style)
    // this.addChild(nameplate)
  }
}

module.exports = Enemy
