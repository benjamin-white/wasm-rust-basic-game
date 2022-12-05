import init, { World, Direction } from 'rust-wasm-game'
import * as CONSTANTS from './constants'
import type { GameStateUI } from './types'

const setupStage = async (
  canvas: HTMLCanvasElement,
  updateUI: (props: Partial<GameStateUI>) => void
) => {

  const wasm = await init()

  const world = World.new(CONSTANTS.WORLD_WIDTH)
  const worldWidth = world.width()
  const gridSize = CONSTANTS.CELL_SIZE * worldWidth
  const rewardColor = getComputedStyle(document.body).getPropertyValue('--color-success') || '#00ff00'
  const ctx = canvas.getContext('2d')!
  let points = world.get_points()
  let gameState = world.get_status_text()
  canvas.width = canvas.height = gridSize

  const play = () => {

    setTimeout(() => {
      ctx.clearRect(0, 0, gridSize, gridSize)
      const _points = world.get_points()
      const _gameState = world.get_status_text()

      if (_points !== points) {
        points = _points
        updateUI({
          points
        })
      }
      if (_gameState !== gameState) {
        gameState = _gameState
        updateUI({
          state: gameState
        })
      }

      draw(gameState)
      requestAnimationFrame(play)
    }, 1000 / CONSTANTS.FPS)

  }

  const draw = (gameState: string) => {

    const trailsCells = new Uint32Array(
      wasm.memory.buffer,
      world.trail_cells(),
      world.player_length()
    )

    trailsCells.forEach((cellIndex, index) => {
      const col = cellIndex % worldWidth
      const row = Math.floor(cellIndex / worldWidth)

      ctx.fillStyle = gameState === 'Loser!'
        ? getComputedStyle(document.body).getPropertyValue('--color-error') || '#ff0000'
        : `rgba(255, ${255 * (1 / trailsCells.length * index)}, 255)`

      ctx.fillRect(
        col * CONSTANTS.CELL_SIZE,
        row * CONSTANTS.CELL_SIZE,
        CONSTANTS.CELL_SIZE,
        CONSTANTS.CELL_SIZE
      )
    })

    drawRewardCell()
    world.update_player_location()

  }

  const drawRewardCell = () => {

    const index = world.get_reward_cell()
    if (!index) return;
    const col = index % worldWidth
    const row = Math.floor(index / worldWidth)

    ctx.fillStyle = rewardColor
    ctx.fillRect(
      col * CONSTANTS.CELL_SIZE,
      row * CONSTANTS.CELL_SIZE,
      CONSTANTS.CELL_SIZE,
      CONSTANTS.CELL_SIZE
    )

  }

  const start = () => {
    updateUI({
      state: world.get_status_text()
    })
    play()
  }

  document.addEventListener('keydown', event => {
    switch (event.code) {
      case 'ArrowUp':
        world.request_location_update(Direction.North)
        break
      case 'ArrowRight':
        world.request_location_update(Direction.East)
        break
      case 'ArrowDown':
        world.request_location_update(Direction.South)
        break
      case 'ArrowLeft':
        world.request_location_update(Direction.West)
    }
  })

  return {
    start: () => {
      const gameStatus = world.get_game_status()
      if (!gameStatus) {
        start()
        world.start_game()
      }
    }
  }

}

export default setupStage