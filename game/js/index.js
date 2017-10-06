// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const titleState     = require('./TitleState')
  const menuState     = require('./MenuState')
  const GameState     = require('./GameState')

  const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game')

  game.stage.backgroundColor = 0x242432

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

  // game.scale.setMinMax(800, 600)

  game.scale.pageAlignVertically = true
  game.scale.pageAlignHorizontally = true

  game.state.add('Boot',          bootState)
  game.state.add('Preload',       preloadState)
  game.state.add('TitleScreen',   titleState)
  game.state.add('TitleMenu',     menuState)
  game.state.add('Game',          GameState)

  game.state.start('Boot')
})
