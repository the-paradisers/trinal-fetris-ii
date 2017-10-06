
class TitleState {

    preload() { }

    create() {
      let logo = this.add.text(
        this.world.centerX,
        this.world.centerY,
        'Trinal Fetris II',
        {fill: 'white', fontSize: 72}
      )

      let press = this.add.text(
        this.world.centerX,
        this.world.centerY + 150,
        'Any Key to Continue',
        {fill: 'white', fontSize: 36}
      )

      logo.anchor.set(0.5)
      press.anchor.set(0.5)

      this.input.onTap.addOnce((pointer) => {
        this.state.start('TitleMenu')
      })
    }

    update() { }
    render() { }
  }

  module.exports = TitleState
