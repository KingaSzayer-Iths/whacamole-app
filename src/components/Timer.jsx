import React, { useState, useRef, useEffect } from "react"


const Timer = ({ time, interval = 1000, onEnd }) => {
    const [internalTime, setInternalTime] = useState(time)
    const timerRef = useRef(time)  
    const timeRef = useRef(time)
    useEffect(() => {
      if (internalTime === 0 && onEnd) {
        onEnd()
      }
    }, [internalTime, onEnd])
    useEffect(() => {
      timerRef.current = setInterval(
        () => setInternalTime((timeRef.current -= interval)),
        interval
      )
      return () => {
        clearInterval(timerRef.current)
      }
    }, [interval])
    return <div className='info-text'>{`Time: ${internalTime / 1000}s`}</div>
  }

export default Timer