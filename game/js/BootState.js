
class BootState {

  preload() {
    this.load.image('preload', 'img/preload.png')
  }

  create() {
    this.input.maxPointers = 1
    this.state.start('Preload')

    this.game.stage.smoothed = false
  }

  update() { }
  render() { }
}

module.exports = BootState
