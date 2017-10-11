const Phaser = require('phaser-ce')

class GameOverState extends Phaser.State {

    preload() {
      this.game.load.audio('gameOverSong', 'audio/Dead_Music.mp3', true)
    }

    create() {
      this.song = this.add.audio('gameOverSong', 1, true)
      this.song.play()

      let gameOver = this.add.text(
        this.world.centerX,
        this.world.centerY,
        'YOU LOSE',
        {fill: 'red', fontSize: 96}
      )

      gameOver.anchor.set(0.5)

      this.input.onTap.addOnce((pointer) => {
        this.state.start('TitleMenu')
      })
    }

  }

  module.exports = GameOverState
