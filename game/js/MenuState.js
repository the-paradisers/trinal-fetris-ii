
class MenuState {

  preload() { }

  create() {
    let tutorial = this.add.text(
      128,
      64,
      `How to Play`,
      {fill: 'white', fontSize: 36}
    )

    let tetris = this.add.text(
      128,
      96,
      `
      Up: Rotate current block
      Down: Drop current block faster
      Left: Move current block to the left
      Right: Move current block to the right\n
      Space: Drop block instantly
      ESC: Pause the game
      `,
      {fill: 'white', fontSize: 24}
    )

    let battle = this.add.text(
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
      `Press Any Button to Start`,
      {fill: 'white', fontSize: 36}
    )

    play.anchor.set(0.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState
