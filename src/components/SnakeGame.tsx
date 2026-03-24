import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);

  const directionRef = useRef(direction);
  const lastProcessedDirection = useRef(INITIAL_DIRECTION);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOccupied) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastProcessedDirection.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const { x, y } = lastProcessedDirection.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        lastProcessedDirection.current = directionRef.current;
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl font-pixel">
      <div className="flex justify-between w-full mb-4 px-4 border-b-4 border-cyan pb-2">
        <div className="text-cyan text-2xl md:text-3xl uppercase tracking-widest flex flex-col">
          <span className="text-magenta text-sm">DATA_YIELD</span>
          {score.toString().padStart(4, '0')}
        </div>
        <div className="text-magenta text-2xl md:text-3xl uppercase tracking-widest flex flex-col items-end">
          <span className="text-cyan text-sm">MAX_YIELD</span>
          {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div
        className="relative bg-black border-4 border-cyan p-1 tear-effect"
        style={{
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          backgroundColor: '#002222'
        }}
      >
        {/* Render Food */}
        <div
          className="bg-magenta"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={isHead ? 'bg-white' : 'bg-cyan'}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-magenta m-2">
            <h2 className="text-5xl md:text-6xl font-bold text-magenta mb-4 glitch-text uppercase text-center" data-text="SYSTEM_FAILURE">
              SYSTEM_FAILURE
            </h2>
            <p className="text-cyan mb-8 text-2xl uppercase tracking-widest">FINAL_YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-black border-2 border-cyan text-cyan text-2xl uppercase hover:bg-cyan hover:text-black transition-none tear-effect"
            >
              INITIATE_REBOOT (ENTER)
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 border-4 border-cyan m-2">
            <h2 className="text-5xl font-bold text-cyan glitch-text uppercase tracking-widest" data-text="SYSTEM_HALT">
              SYSTEM_HALT
            </h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-magenta text-xl text-center uppercase tracking-widest border border-magenta p-4 bg-black/50">
        <p>INPUT: <span className="text-cyan">ARROWS / WASD</span></p>
        <p>OVERRIDE: <span className="text-cyan">SPACE</span> (PAUSE)</p>
      </div>
    </div>
  );
}
