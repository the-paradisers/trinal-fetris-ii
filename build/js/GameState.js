/* eslint-disable no-labels, complexity */
const Tetris = require('./Object/Tetris.js')
const Player = require('./Object/Player');

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
  }

  create() {
    this.handleText = this.handleText.bind(this)

    this.tetris = new Tetris(this)
    this.player = new Player(this);
    this.player.renderSkills();

    // values needed to handle updates
    this.tetris.draw()

    // keyboard listeners
    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
    }

  }



  handleText(xCord, yCord, str, options, anchor) {
    let text = this.add.text(xCord, yCord, str, options)
    text.anchor.set(anchor)
  }

  // handleGameOver() {
  //   this.handleText(
  //     this.world.centerX,
  //     this.world.centerY,
  //     'Game Over',
  //     {fill: 'red', fontSize: 72},
  //     0.5
  //   )

  //   this.input.onTap.addOnce((pointer) => {
  //     this.world.removeAll()
  //     this.state.start('MainMenu')
  //   })
  // }

  update() {
    this.tetris.clock(this.time.elapsed, 1)

    // allows for left and right movement of current piece
    if (this.keys.leftKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.move(-1)
      }
    } else if (this.keys.rightKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.move(1)
      }
    } else if (this.keys.downKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.dropBlock()
      }
    } else if (this.keys.upKey.isDown) {
      if (this.tetris.canMove) {
        this.tetris.startCooldown()
        this.tetris.blockRotate()
      }
    }

    this.tetris.draw()

  }

  render() {}
}

module.exports = GameState;
