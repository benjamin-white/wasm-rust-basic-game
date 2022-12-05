import React, { useEffect, useMemo, useRef, useState } from 'react'
import Info from '../Info'
import Controls from '../Controls'
import styles from './Stage.module.css'
import { CELL_SIZE, INITIAL_STATUS } from './constants'
import setupStage from './utils'
import type { GameStateUI } from './types'

const Stage = () => {
  
  const initialised = useRef(false)
  const canvasRef = useRef(null)
  const canvas = useMemo(() =>
    <canvas ref={canvasRef}></canvas>,
    []
  )

  const [gameState, setGameState] = useState<GameStateUI>({
    state: INITIAL_STATUS,
    points: 0,
    update: () => {},
  })
  
  const gameStateChange = (props: Partial<GameStateUI>) => {
    setGameState((currentState: GameStateUI)=> ({
      ...currentState,
      ...props
    }))
  }
  
  useEffect(() => {
    const run = async () => {
      if (!initialised.current) {
        const game = await setupStage(canvasRef.current!, gameStateChange)
        gameStateChange({
          update: game.start
        })
        initialised.current = true
      }
    }
    run()
  }, [])

  return (
    <section>
      <header className={styles.StageHeader}>
        <Info statusText={gameState.state} points={gameState.points} />
        <Controls handleClick={gameState.update} buttonText="Play?" />
      </header>
      <div className={styles.Stage} style={{'--grid-size': CELL_SIZE} as React.CSSProperties}>
        {canvas}
      </div>
    </section>
  )
}

export default Stage