/* eslint-disable no-labels, complexity */
const Tetris = require('./Object/Tetris.js')
const Battle = require('./Object/Battle')

class GameState {

  preload() {
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
  }

  create() {
    this.handleText = this.handleText.bind(this)

    // Tetris
    this.tetris = new Tetris(this)
    this.tetris.draw()

    // Battle
    const enemyData1 = {
      frame: 0,
      name: 'Werewolf',
      level: 1,
      HP: 10,
    }
    const enemyData2 = {
      frame: 1,
      name: 'Devil Wolf',
      level: 1,
      HP: 12,
    }
    const enemyData3 = {
      frame: 2,
      name: 'Werepanther',
      level: 1,
      HP: 14,
    }
    const enemyGroup = [enemyData1, enemyData2, enemyData3]
    this.battle = new Battle(this.game, enemyGroup)
    console.log('Initial battle instance', this.battle)
    this.battle.summonEnemies()
    console.log('Battle after summoning enemies', this.battle)
    console.log('First enemy', this.battle.children[0])
    this.battle.children.forEach(enemy => enemy.draw())

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
