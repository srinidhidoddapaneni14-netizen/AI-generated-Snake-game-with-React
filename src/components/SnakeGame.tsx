import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    generateFood([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      const head = { ...snake[0] };

      switch (nextDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return;
      }

      const newSnake = [head, ...snake];

      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, food, nextDirection, isGameOver, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Snake
    snake.forEach((segment, index) => {
      ctx.shadowBlur = index === 0 ? 15 : 0;
      ctx.shadowColor = '#00f2ff';
      ctx.fillStyle = index === 0 ? '#00f2ff' : '#0066ff';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-cyan-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="opacity-50">SCORE:</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 opacity-50" />
          <span className="opacity-50">BEST:</span>
          <span className="text-xl font-bold">{highScore}</span>
        </div>
      </div>

      <div className="relative group p-[3px] bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl shadow-[0_0_50px_rgba(192,38,211,0.2)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg"
          id="snake-canvas"
        />

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4 tracking-tighter">
                GAME OVER
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all group mb-3"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Play Again
              </button>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cyan-500 font-black text-[10px] tracking-[0.4em] uppercase"
              >
                snake game
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-white/30 text-xs font-mono uppercase tracking-[0.2em]">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
};
