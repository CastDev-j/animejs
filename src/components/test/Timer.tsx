import {
  createDraggable,
  createScope,
  createSpring,
  createTimer,
  Scope,
  Timer,
  utils,
} from "animejs";
import { useEffect, useRef, useState } from "react";

export const TimerComponent = () => {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope>(null!);

  const [timerValue, setTimerValue] = useState(0);
  const [loops, setLoops] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [frameRate, setFrameRate] = useState(60);

  const [timer, setTimer] = useState<Timer>();

  const [stopWatch, setStopWatch] = useState(0);
  const [stopWatchCount, setStopWatchCount] = useState(0);

  const [isBegan, setIsBegan] = useState(false);
  const [beganCurrentTime, setBeganCurrentTime] = useState(0);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      const timer = createTimer({
        frameRate: frameRate,
        duration: 1000,
        loopDelay: 500,
        playbackRate: 1, // 1x speed
        alternate: true,
        loop: true,
        onLoop: (t) => {
          setLoops((prev) => prev + 1);
        },
        onUpdate: (t) => {
          setTimerValue(utils.clamp(t.iterationCurrentTime, 0, 1000));
          setCurrentTime(t.currentTime);
        },
        onBegin: (t) => {
          setIsPlaying(true);
        },
      });

      setTimer(timer);

      createTimer({
        duration: 10000,
        reversed: true,
        onUpdate: (self) => {
          setStopWatch(utils.clamp(self.iterationCurrentTime, 0, 10000));
          setStopWatchCount(utils.clamp(self.currentTime, 0, 10000));
        },
      });

      createTimer({
        duration: 2000,
        delay: 2000,
        onUpdate: (self) => {
          if (self.currentTime > 0 && !isBegan) {
            setBeganCurrentTime(self.currentTime);
            setIsBegan(true);
          }
          if (self.currentTime === 0) {
            setIsBegan(false);
          }
        },
      });

      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });
    });

    return () => scope.current.revert();
  }, []);

  const onHandlePlay = () => {
    if (timer) {
      timer.play();
      setIsPlaying(true);
    }
  };

  const onHandlePause = () => {
    if (timer) {
      timer.pause();
      setIsPlaying(false);
    }
  };

  const onHandleReset = () => {
    if (timer) {
      timer.reset();
      setLoops(0);
      setTimerValue(0);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const onHandleFrameRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timer) {
      const newFrameRate = Number(e.target.value);
      setFrameRate(newFrameRate);
      timer.fps = newFrameRate;
    }
  };

  return (
    <div
      ref={root}
      className="w-full flex flex-col justify-center items-center gap-2"
    >
      <div className="flex flex-col w-full max-w-64 items-start gap-1">
        <div className="text-lg font-semibold text-gray-700">
          Stopwatch_Count: {stopWatchCount} ms
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Stopwatch: {stopWatch} ms
        </div>
      </div>

      <div className="h-px my-4 w-full max-w-64 bg-neutral-800" />

      <div className="flex flex-col w-full max-w-64 items-start gap-1">
        <div className="text-lg font-semibold text-gray-700">
          Began Count: {beganCurrentTime} ms
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Began Stopwatch: {isBegan ? "Began" : "Not Began"}
        </div>
      </div>

      <div className="h-px my-4 w-full max-w-64 bg-neutral-800" />

      <div className="flex justify-start w-full max-w-64 items-center gap-2">
        <div className="text-lg font-semibold text-gray-700">
          Current Timer: {currentTime} ms
        </div>
      </div>
      <div className="logo flex justify-start w-full max-w-64 items-center gap-2">
        <div className="text-lg font-semibold text-gray-700">
          loops: {loops}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Timer: {timerValue} ms
        </div>
      </div>
      <div className="flex justify-start w-full max-w-64 items-center gap-2">
        <div className="text-lg font-semibold text-gray-700 flex justify-start">
          {isPlaying ? "Playing" : "Paused"}
        </div>
      </div>

      <div className="flex gap-2 mt-2 w-full max-w-64 items-center justify-start">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isPlaying}
          onClick={onHandlePlay}
        >
          Play
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!isPlaying}
          onClick={onHandlePause}
        >
          Pause
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={onHandleReset}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-4 w-full max-w-64 items-start justify-start">
        <label
          htmlFor="frameRateSlider"
          className="text-lg font-semibold text-gray-700"
        >
          Frame Rate: {frameRate} fps
        </label>
        <input
          id="frameRateSlider"
          type="range"
          min="0"
          max="120"
          value={frameRate}
          onChange={onHandleFrameRateChange}
          className="w-full appearance-none bg-gray-300 rounded h-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-500">
          Adjust the frame rate to control the timer's update frequency.
        </div>
      </div>
    </div>
  );
};
