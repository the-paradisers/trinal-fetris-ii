/* eslint-disable no-labels, complexity */

const Battle = require('./Object/Battle')
const Player = require('./Object/Player');
const Tetris = require('./Object/Tetris')
const Phaser = require('phaser-ce')

class GameState extends Phaser.State {

  preload() {
    this.load.image('background', 'img/TF2BACKGROUND.png')
    this.load.bitmapFont('fantasy', 'img/font/font.png', 'img/font/font.fnt')
    this.load.image('addSkillPoint', 'img/addskillpoint.png')
    this.load.spritesheet('blocks', 'img/blocks.png', 32, 32, 7)
    this.load.spritesheet('enemy-animals', 'img/enemy-animals.png', 100, 100, 32)
    this.load.spritesheet('player', 'img/player.png', 50, 52, 7)
    this.load.spritesheet('plains', 'img/background/Plains.gif', 512, 64)
  }

  create() {
    this.add.image(0, 0, 'background')
    const plains = this.add.tileSprite(0, 0, 640, 64, 'plains')
    plains.scale.setTo(2, 2)

    // For adding signals to access across game
    this.setSignals()

    this.player = new Player(this.game);
    this.player.initialize();
    this.tetris = new Tetris(this.game);

    // values needed to handle updates
    this.tetris.draw()

    // Battle loop
    this.timer = this.game.time.events
    this.battleTimerLoop = this.timer.loop(Phaser.Timer.SECOND * 20, this.startBattle, this)

    this.keys = {
      upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      qKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      wKey: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      eKey: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      rKey: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
      spaceKey: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      escKey: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
    }

    this.keys.escKey.onUp.add(() => {this.game.paused = !this.game.paused})

    this.keys.qKey.onDown.add(() => this.game.signals.skillSignal.dispatch('q'))
    this.keys.wKey.onDown.add(() => this.game.signals.skillSignal.dispatch('w'))
    this.keys.eKey.onDown.add(() => this.game.signals.skillSignal.dispatch('e'))
    this.keys.rKey.onDown.add(() => this.game.signals.skillSignal.dispatch('r'))
  }

  setSignals() {
    this.game.signals = {}
    this.messageArr = []

    const logSignal = new Phaser.Signal()
    logSignal.add(this.write, this)
    this.game.signals.logSignal = logSignal
  }

  write(newMessage) {
    const x = 10
    const y = 600
    const style = {
      fill: 'white',
      font: '16pt Arial'
    }

    if (this.battleLog) {
      this.battleLog.forEach(message => message.destroy())
    }

    this.messageArr.push(newMessage)
    while (this.messageArr.length > 5) this.messageArr.shift()

    this.battleLog = this.messageArr.map((message, i) => {
      return this.game.add.text(x, y + (i * 18), message, style)
    })
  }

  startBattle() {
    this.game.signals.logSignal.dispatch("You've been attacked!")

    // Pause battle timer during battle
    this.timer.pause()

    // Temporary data
    const enemyData1 = {
      frame: 0,
      name: 'Werewolf',
      level: 1,
      HP: 20,
    }
    const enemyData2 = {
      frame: 1,
      name: 'Devil Wolf',
      level: 1,
      HP: 15,
    }
    const enemyData3 = {
      frame: 2,
      name: 'Werepanther',
      level: 1,
      HP: 30,
    }
    const enemyGroup = [enemyData1, enemyData2, enemyData3]

    // Initialize battle and draw enemies
    this.battle = new Battle(this.game, enemyGroup)
    this.battle.initialize()
    this.battle.children.forEach(enemy => {
      enemy.draw()
    })

    // Create signal to listen for end
    this.game.signals.endBattle = new Phaser.Signal()
    this.game.signals.endBattle.add(this.endBattle, this)
  }

  endBattle() {
    this.game.signals.logSignal.dispatch('You won the battle!')
    this.game.signals.expSignal.dispatch(50)
    this.battle.destroy()
    this.game.signals.DMGtoMonster.dispose()
    this.timer.resume()
  }

  update() {
    this.tetris.clock(this.time.elapsed, 1)

    if (this.keys.leftKey.isDown) {
      this.tetris.move('left')
    } else if (this.keys.rightKey.isDown) {
      this.tetris.move('right')
    } else if (this.keys.downKey.isDown) {
      this.tetris.move('drop')
    } else if (this.keys.upKey.isDown) {
      this.tetris.move('rotate')
    } else if (this.keys.spaceKey.isDown){
      this.tetris.move('fastDrop');
    }
  }

  render() {}
}

module.exports = GameState
