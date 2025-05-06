import { animate, createScope, waapi, type Scope, utils, type Target } from "animejs";
import { useEffect, useRef } from "react";

export const AnimationComponent = () => {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope>(null!);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      animate(".square-only", {
        x: {
          to: 115,
          ease: "outCubic",
        },
        width: "+=150",
        borderRadius: 64,
        duration: 2000,
        background: "#FF4B4B33",
        loop: true,
        alternate: true,
      });

      animate(["feTurbulence", "feDisplacementMap"], {
        baseFrequency: 0.05,
        scale: 15,
        alternate: true,
        loop: true,
      });

      animate("polygon", {
        points: "64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100",
        alternate: true,
        loop: true,
      });

      waapi.animate('.square',  {
        rotate: '360deg',
        borderColor: ['#FF4B4B', '#4BFF4B'],
      });

      const cssVar = (name: string, $el: HTMLElement) => utils.get($el, name);

      animate('.square',  {
        scale: ($el: Target) => cssVar('--scale-factor', $el as HTMLElement) || 1.5,
        background: [
          ($el) => cssVar('--start-color', $el as HTMLElement) || '#0a0a0a',
          ($el) => cssVar('--end-color', $el as HTMLElement) || '#0a0a0a',
        ],
      });

    });

    return () => scope.current.revert();
  }, []);

  return (
    <div
      ref={root}
      className="w-full flex flex-col justify-center items-start gap-2"
    >
      <div className="w-full">
        <div className="square-only flex size-16 rounded bg-neutral-950"></div>
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-2">
        <div className="large centered row">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <filter id="displacementFilter">
              <feTurbulence
                type="turbulence"
                numOctaves="2"
                baseFrequency="0"
                result="turbulence"
              />
              <feDisplacementMap
                in2="turbulence"
                in="SourceGraphic"
                scale="1"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <polygon
              points="64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="flex gap-2 justify-center items-center flex-wrap w-full">
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
        <div className="square size-16 rounded bg-neutral-950"></div>
      </div>
    </div>
  );
};
