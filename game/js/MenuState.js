
class MenuState {

  preload() { }

  create() {

    this.add.text(
      128,
      64,
      `How to Play`,
      {fill: 'skyblue', fontSize: 36}
    )

    this.add.text(
      128,
      96,
      `
      Up: Rotate block
      Down: Move block down
      Left: Move cblock left
      Right: Move block right\n
      Space: Drop block instantly
      ESC: Pause the game
      `,
      {fill: 'white', fontSize: 24}
    )

    this.add.text(
      this.world.centerX,
      96,
      `
      1: Target top left enemy
      2: Target top right enemy
      3: Target bottom left enemy
      4: Target bottom right enemy\n
      Q: Use player spells labeled Q
      W: Use player spells labeled W
      E: Use player spells labeled E
      R: Use player spells labeled R\n
      `,
      {fill: 'white', fontSize: 24}
    )

    let play = this.add.text(
      this.world.centerX,
      this.world.centerY + 200,
      `Click to Play`,
      {fill: 'gold', fontSize: 36}
    )

    play.anchor.set(0.5)

    this.input.onTap.addOnce((pointer) => {
      this.sound.stopAll()
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState
