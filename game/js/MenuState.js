
class MenuState {

  preload() { }

  create() {
    // let logo = this.add.image(
    //   this.world.centerX,
    //   this.world.centerY,
    //   'logo')

    let gameName = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Trinal Fetris II',
      { fill: 'white' }
    )

    gameName.anchor.set(0.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState
