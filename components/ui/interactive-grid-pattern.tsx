'use client';

import { useRef, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

interface InteractiveGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  xOffset?: number;
  yOffset?: number;
  squares?: number[][];
  maxSquares?: number;
  size?: number;
  gap?: number;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

export function InteractiveGridPattern({
  className,
  width = 40,
  height = 40,
  xOffset = 0,
  yOffset = 0,
  squares = [],
  maxSquares = 50,
  size = 4,
  gap = 1,
  strokeWidth = 0.5,
  strokeColor = '#F0B90B',
  fillColor = '#F0B90B',
  fillOpacity = 0.1,
}: InteractiveGridPatternProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSquare, setHoveredSquare] = useState<[number, number] | null>(
    null
  );
  const [squaresState, setSquaresState] = useState<number[][]>(squares);

  const generateSquares = () => {
    const newSquares: number[][] = [];
    for (let i = 0; i < maxSquares; i++) {
      newSquares.push([
        Math.floor(Math.random() * width),
        Math.floor(Math.random() * height),
      ]);
    }
    setSquaresState(newSquares);
  };

  useEffect(() => {
    if (squares.length === 0) {
      generateSquares();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares.length, maxSquares, width, height]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / (size + gap));
    const gridY = Math.floor(y / (size + gap));

    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      setHoveredSquare([gridX, gridY]);
    } else {
      setHoveredSquare(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSquare(null);
  };

  const handleSquareClick = (x: number, y: number) => {
    setSquaresState(prev => {
      const newSquares = [...prev];
      const existingIndex = newSquares.findIndex(
        ([sx, sy]) => sx === x && sy === y
      );

      if (existingIndex >= 0) {
        newSquares.splice(existingIndex, 1);
      } else {
        newSquares.push([x, y]);
      }

      return newSquares;
    });
  };

  return (
    <svg
      ref={svgRef}
      className={cn('h-full w-full', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <pattern
          id="grid"
          width={size + gap}
          height={size + gap}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={size}
            height={size}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={0.1}
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        x={xOffset}
        y={yOffset}
      />

      {squaresState.map(([x, y], index) => (
        <rect
          key={index}
          x={x * (size + gap) + xOffset}
          y={y * (size + gap) + yOffset}
          width={size}
          height={size}
          fill={fillColor}
          fillOpacity={fillOpacity}
          className="hover:fill-opacity-30 transition-all duration-200"
          onClick={() => handleSquareClick(x, y)}
        />
      ))}

      {hoveredSquare && (
        <rect
          x={hoveredSquare[0] * (size + gap) + xOffset}
          y={hoveredSquare[1] * (size + gap) + yOffset}
          width={size}
          height={size}
          fill={fillColor}
          fillOpacity={0.2}
          className="pointer-events-none"
        />
      )}
    </svg>
  );
}
