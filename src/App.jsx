import React, { useState, useEffect, useRef } from "react"
import Timer from "./components/Timer"
import gsap from "gsap"
// import PropTypes from 'prop-types'
// import splitting from "splitting"

// const confetti = require('canvas-confetti');
// import { getSpaceUntilMaxLength } from "@testing-library/user-event/dist/utils"


const TIME_LIMIT = 30000
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

const useAudio = (src, volume = 1) => {
  const [audio, setAudio] = useState(null)
  useEffect(() => {
    const AUDIO = new Audio(src)
    AUDIO.volume = volume
    setAudio(AUDIO)
  }, [src, volume])
  return {
    play: () => audio.play(),
    pause: () => audio.pause(),
    stop: () => {
      audio.pause()
      audio.currentTime = 0
    },
  }
}

const Moles = ({ children }) => <div className="moles">{children}</div>
const Mole = ({ onWhack, points, delay, speed, pointsMin = 10 }) => {
  const [whacked, setWhacked] = useState(false)
  const bobRef = useRef(null)
  const pointsRef = useRef(points)
  const buttonRef = useRef(null)

  const [image, setImage] = useState(Math.floor(Math.random() * 5)) 

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
    setImage(Math.floor(Math.random() * 5))
  }
  return (
    <div className="mole-hole" >
      <button
        className={"mole mole"+image}
        ref={buttonRef}
        onClick={whack}><span className="sr-only">Whack</span></button>
    </div>
  )
}
const Score = ({ value }) => <div className='info-text'>{`Score: ${value}`}</div>



function App() {
  const [moles, setMoles] = useState([])
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [newHighScore, setNewHighScore] = useState(false)
  // const [muted, setMuted] = usePersistentState('whac-muted', true)
  const [highScore, setHighScore] = usePersistentState('whac-a-mole-hi', 0)
  const { play: playSqueak } = useAudio('https://assets.codepen.io/605876/squeak-in.mp3')
  // const { play: playSparkle } = useAudio(
  //   'https://assets.codepen.io/605876/sparkle.mp3')
    // const { play: playWhistle } = useAudio(
    //   'https://assets.codepen.io/605876/whistle.mp3', 0.65)
    // const { play: playThud } = useAudio(
    //   'https://assets.codepen.io/605876/thud--small.mp3',0.65)
    // const { play: playSparkle } = useAudio(
    //   'https://assets.codepen.io/605876/sparkle.mp3')
    // const { play: playCount } = useAudio(
    //   'https://assets.codepen.io/605876/countdown-beep.mp3')
    // const { play: playWhack } = useAudio(
    //   'https://assets.codepen.io/605876/pop.mp3')
    // const { play: playSqueakOut } = useAudio(
    //   'https://assets.codepen.io/605876/squeak-out.mp3')
    // const { play: playCheer } = useAudio(
    //   'https://assets.codepen.io/605876/kids-cheering.mp3')
    // const { play: playClick } = useAudio(
    //   'https://assets.codepen.io/605876/click.mp3')

  // const onWhack = (points, golden) => {
  //   gsap.to(boardRef.current, {
  //     yPercent: 2,
  //     repeat: 1,
  //     yoyo: true,
  //     duration: 0.05,
  //   })
  //   if (!muted) {
  //     playThud()
  //     if (golden) playSparkle()
  //     else {
  //       // Play random noise from selection
  //       ;[playWhack, playSqueak, playSqueakOut][Math.floor(Math.random() * 3)]()
  //     }
  //   }
  //   setScore(score + points)
  // }

  const onWhack = points => {
    playSqueak() 
    setScore(score + points)
  }

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
        <h1>SPEED</h1>
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
