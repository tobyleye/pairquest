import { useState, useEffect } from "react";
import { useWindowFocused } from "./useWindowFocused";

export function useTimer(initialState = {}) {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(initialState.paused ?? false);
  const windowFocused = useWindowFocused();

  useEffect(() => {
    let id;
    if (paused === false && windowFocused === true) {
      id = setTimeout(() => {
        setSeconds((secs) => secs + 1);
      }, 1000);
    }
    return () => {
      clearTimeout(id);
    };
  }, [seconds, paused, windowFocused]);

  return {
    seconds,
    formattedTime: secondsToReadable(seconds),
    restart() {
      setSeconds(0);
      setPaused(false);
    },
    start: () => setPaused(false),
    stop: () => setPaused(true),
  };
}

function secondsToReadable(seconds) {
  const format = (unit) => `${unit}`.padStart(2, "0");

  let mm = parseInt(seconds / 60);
  let ss = seconds % 60;

  return `${format(mm)}:${format(ss)}`;
}
