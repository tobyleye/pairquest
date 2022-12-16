import { useState, useEffect } from "react";

export function useTimer(initialState = {}) {
  const [seconds, setSeconds] = useState(0);
  const [_paused, setPaused] = useState(initialState.paused ?? false);

  useEffect(() => {
    let id;
    if (!_paused) {
      id = setTimeout(() => {
        setSeconds((secs) => secs + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [seconds, _paused]);

  const restart = () => {
    setSeconds(0);
    setPaused(false);
  };

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  // not that expensive if you ask me
  const formattedTime = secondsToReadable(seconds);

  return {
    seconds,
    restart,
    formattedTime,
    pause,
    resume,
  };
}

function secondsToReadable(seconds) {
  let mm = parseInt(seconds / 60);
  let ss = seconds % 60;

  return `${mm}:${ss}`;
}
