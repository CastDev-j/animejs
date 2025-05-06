import {
  createDraggable,
  createScope,
  createSpring,
  createTimer,
  Scope,
} from "animejs";
import { useEffect, useRef, useState } from "react";

export const Timer = () => {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope>(null!);

  const [timerValue, setTimerValue] = useState(0);
  const [loops, setLoops] = useState(0);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {

      createTimer({
        frameRate: 60,
        loop: true,
        duration: 1000,
        onLoop: (t) => {
          setLoops((prev) => prev + 1);
        },
        onUpdate: (t) => {
          setTimerValue(t.iterationCurrentTime);
        },
      });

      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });
    });

    return () => scope.current.revert();
  }, []);

  return (
    <div
      ref={root}
      className="w-full flex flex-col justify-center items-center"
    >
      <div className="logo flex justify-between w-full max-w-56 items-center gap-2">
        <div className="text-lg font-semibold text-gray-700">
          loops: {loops}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Timer: {timerValue} ms
        </div>
      </div>
    </div>
  );
};
