const Phaser = require('phaser-ce')

class TitleState extends Phaser.State {

    preload() {
      this.game.load.spritesheet('title', 'img/titleScreen.png', 1280, 720)
      this.game.load.audio('titleAudio', 'audio/Prelude.mp3', true)
    }

    create() {
      this.song = this.add.audio('titleAudio', 1, true)
      this.song.play()

      let title = this.add.sprite(0, 0, 'title')
      title.animations.add('go', [0, 1, 2, 3, 4, 5], 6, true)
      title.animations.play('go')


      let press = this.add.text(
        this.world.centerX,
        this.world.centerY + 100,
        'Click to Continue',
        {fill: 'white', fontSize: 36}
      )

      press.anchor.set(0.5)

      this.input.onTap.addOnce((pointer) => {
        this.state.start('TitleMenu')
      })
    }

    update() { }
    render() { }
  }

  module.exports = TitleState
