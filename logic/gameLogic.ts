
import { Piece, PieceType, Direction } from '../types';
// Correctly import grid constants from the constants file
import { GRID_WIDTH, GRID_HEIGHT } from '../constants';

export const getInitialPieces = (): Piece[] => [
  {
    id: 'target-red',
    type: PieceType.TARGET,
    x: 1,
    y: 0,
    w: 2,
    h: 1,
    color: '#ef4444', // Red-500
  },
  {
    id: 'blue-rect-left',
    type: PieceType.OBSTACLE_RECT,
    x: 0,
    y: 1,
    w: 1,
    h: 2,
    color: '#38bdf8', // Sky-400
  },
  {
    id: 'blue-rect-right',
    type: PieceType.OBSTACLE_RECT,
    x: 3,
    y: 1,
    w: 1,
    h: 2,
    color: '#38bdf8', // Sky-400
  },
  {
    id: 'square-1',
    type: PieceType.OBSTACLE_SQUARE,
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    color: '#38bdf8', // Sky-400
  },
  {
    id: 'square-2',
    type: PieceType.OBSTACLE_SQUARE,
    x: 2,
    y: 1,
    w: 1,
    h: 1,
    color: '#38bdf8', // Sky-400
  },
  {
    id: 'square-3',
    type: PieceType.OBSTACLE_SQUARE,
    x: 1,
    y: 2,
    w: 1,
    h: 1,
    color: '#38bdf8', // Sky-400
  },
  {
    id: 'square-4',
    type: PieceType.OBSTACLE_SQUARE,
    x: 2,
    y: 2,
    w: 1,
    h: 1,
    color: '#38bdf8', // Sky-400
  },
];

export const isOccupied = (x: number, y: number, pieces: Piece[], excludeId?: string): boolean => {
  return pieces.some(p => {
    if (p.id === excludeId) return false;
    return x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h;
  });
};

export const canMove = (piece: Piece, direction: Direction, pieces: Piece[]): boolean => {
  let dx = 0, dy = 0;
  if (direction === 'UP') dy = -1;
  else if (direction === 'DOWN') dy = 1;
  else if (direction === 'LEFT') dx = -1;
  else if (direction === 'RIGHT') dx = 1;

  const newX = piece.x + dx;
  const newY = piece.y + dy;

  // Boundary check
  if (newX < 0 || newX + piece.w > GRID_WIDTH || newY < 0 || newY + piece.h > GRID_HEIGHT) {
    return false;
  }

  // Collision check for all cells the piece will occupy
  for (let ox = 0; ox < piece.w; ox++) {
    for (let oy = 0; oy < piece.h; oy++) {
      const targetX = newX + ox;
      const targetY = newY + oy;
      if (isOccupied(targetX, targetY, pieces, piece.id)) {
        return false;
      }
    }
  }

  return true;
};

export const checkWin = (pieces: Piece[]): boolean => {
  const target = pieces.find(p => p.type === PieceType.TARGET);
  // Win condition: Red block (2x1) is at the bottom row (y=2)
  return target ? target.y === 2 : false;
};
