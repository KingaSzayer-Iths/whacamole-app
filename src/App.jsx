import React, { useState, useEffect, useRef } from "react"
import Timer from "./components/Timer"
import gsap from "gsap"


const TIME_LIMIT = 10000
const MOLE_SCORE = 100
const NUMBER_OF_MOLES = 5
const POINTS_MULTIPLIER = 0.9
const TIME_MULTIPLIER = 1.25

const generateMoles = amount => new Array(amount).fill().map(() => ({
  speed: gsap.utils.random(0.5, 1),
  delay: gsap.utils.random(0.5, 4),
  points: MOLE_SCORE
}))

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(
    window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key))
      : initialValue
  )
  useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state])
  return [state, setState]
}

const Moles = ({ children }) => <div className="moles">{children}</div>
const Mole = ({ onWhack, points, delay, speed, pointsMin = 10 }) => {
  const [whacked, setWhacked] = useState(false)
  const bobRef = useRef(null)
  const pointsRef = useRef(points)
  const buttonRef = useRef(null)
  useEffect(() => {
    gsap.set(buttonRef.current, {
      yPercent: 100,
      display: 'block'
    })
    bobRef.current = gsap.to(buttonRef.current, {
      yPercent: 0,
      duration: speed,
      yoyo: true,
      repeat: -1,
      delay: delay,
      repeatDelay: delay,
      onRepeat: () => {
        pointsRef.current = Math.floor(
          Math.max(pointsRef.current * POINTS_MULTIPLIER, pointsMin)
        )
      },
    })
    return () => {
      if (bobRef.current) bobRef.current.kill()
    }
  }, [pointsMin, delay, speed])
  
  
  useEffect(() => {
    if (whacked) {
      pointsRef.current = points
      bobRef.current.pause()
      gsap.to(buttonRef.current, {
        yPercent: 100,
        duration: 0.1,
        onComplete: () => {
          gsap.delayedCall(gsap.utils.random(1, 3), () => {
            setWhacked(false)
            bobRef.current
             .restart()
             .timeScale(bobRef.current.timeScale() * TIME_MULTIPLIER)
          })
        },
      })
    }
  }, [whacked, points])
  
  const whack = () => {
    setWhacked(true)
    onWhack(pointsRef.current)   
  }
  return (
    <div className="mole-hole">
      <button
        className="mole"
        ref={buttonRef}
        onClick={whack}><span className="sr-only">Whack</span></button>
    </div>
  )
}
const Score = ({ value }) => <div className='info-text'>{`Score: ${value}`}</div>



function App() {
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [moles, setMoles] = useState([])
  const [highScore, setHighScore] = usePersistentState('whac-a-mole-hi', 0)
  const [newHighScore, setNewHighScore] = useState(false)

  const onWhack = points => setScore(score + points)

  const endGame = () => {
    setPlaying(false)
    setFinished(true)
    if (score > highScore) {
      setHighScore(score)
      setNewHighScore(true)
    }
  }
  
  const startGame = () => {
    setMoles(generateMoles(NUMBER_OF_MOLES))
    setScore(0)
    setPlaying(true)
    setFinished(false)
    setNewHighScore(false)
  }
      
  /* Shift+Alt+A ()=kommentera bort) */
  /* Ctrl+Alt+R (skriv) _rafce  (=for att Create Function Component with ES7module system) */
  /* Ctrl+B (=for att gömma file fältet)*/
  /* Ctrl+Shift+Ö (=öppna new Terminal) */
  
  return (
    <>
      {!playing && !finished && 
      <>
        <h1>Whac-A-Mole</h1>
        <button onClick={startGame}>Start Game</button>
      </>}

      {playing && (
        <>
        <button
          className="end-game"
          onClick={endGame}>End Game</button>

          <div className="info">
            <Score value={score} />
            <Timer
              time={TIME_LIMIT}
              onEnd={endGame}
            />
          </div>
            
          <Moles>
            {moles.map(({delay, speed, points}, index) => (
              <Mole
                key={index}
                onWhack={onWhack}
                points={points}
                delay={delay}
                speed={speed}
              />
            ))}
          </Moles>
        </>)}
        {finished && 
        <>
        {newHighScore && <div className="info-text">NEW High Score!</div>}
          <Score value={score} />
          <button onClick={startGame}>Play Again</button>
        </>}
    </>
  );
}

export default App;
