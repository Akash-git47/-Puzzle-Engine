
export enum PieceType {
  TARGET = 'TARGET',
  OBSTACLE_RECT = 'OBSTACLE_RECT',
  OBSTACLE_SQUARE = 'OBSTACLE_SQUARE'
}

export interface Piece {
  id: string;
  type: PieceType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface GameState {
  pieces: Piece[];
  moves: number;
  isSolved: boolean;
  history: Piece[][];
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}
