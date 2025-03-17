import { useEffect, useRef } from "react";

interface AnimatedSpriteProps {
  src: string;
  frameHeight: number;
  totalFrames: number;
  fps: number;
  className?: string;
  size?: number;
}

export function AnimatedSprite({
  src,
  frameHeight,
  totalFrames,
  fps,
  className = "",
  size = 32,
}: AnimatedSpriteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a unique animation name based on the component instance
    const animationName = `sprite-animation-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create a style element for our keyframes
    const styleElement = document.createElement("style");

    // Calculate the animation duration based on fps and total frames
    const animationDuration = totalFrames / fps;

    // Generate keyframes for smooth animation
    let keyframes = `@keyframes ${animationName} {`;

    // Create a smooth step for each frame
    for (let i = 0; i < totalFrames; i++) {
      const percentage = (i / totalFrames) * 100;
      const nextPercentage = ((i + 1) / totalFrames) * 100;

      // Position for this frame
      keyframes += `
        ${percentage}% {
          transform: translateY(-${i * frameHeight}px);
        }
        ${percentage + 0.001}% {
          transform: translateY(-${i * frameHeight}px);
        }
      `;

      // Only add the last keyframe if we're at the last frame
      if (i === totalFrames - 1) {
        keyframes += `
          100% {
            transform: translateY(-${i * frameHeight}px);
          }
        `;
      }
    }

    keyframes += `}`;

    // Add the keyframes to the style element
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);

    // Apply the animation to our sprite element
    if (containerRef.current) {
      const spriteElement = containerRef.current.querySelector("div");
      if (spriteElement) {
        spriteElement.style.animation = `${animationName} ${animationDuration}s steps(1) infinite`;
        // Remove the transition property as we're using animation now
        spriteElement.style.transition = "none";
      }
    }

    // Clean up the style element when the component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [fps, totalFrames, frameHeight]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${frameHeight * totalFrames}px`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${size}px ${frameHeight * totalFrames}px`,
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform", // Hint to browser to optimize transform animations
        }}
      />
    </div>
  );
}
