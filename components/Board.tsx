
import React, { useMemo } from 'react';
import { Piece, Direction } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, BOARD_PADDING } from '../constants';
import PieceComponent from './Piece';

interface BoardProps {
  pieces: Piece[];
  onMovePiece: (pieceId: string, direction: Direction) => void;
  isSolved: boolean;
}

const Board: React.FC<BoardProps> = ({ pieces, onMovePiece, isSolved }) => {
  const innerWidth = GRID_WIDTH * CELL_SIZE;
  const innerHeight = GRID_HEIGHT * CELL_SIZE;

  // Render empty grid cells for visual aid
  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        cells.push(
          <div
            key={`grid-${x}-${y}`}
            className="absolute border border-slate-200/50 pointer-events-none rounded-sm"
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      }
    }
    return cells;
  }, []);

  return (
    <div className="relative flex flex-col items-center unselectable touch-none">
      {/* Removed Status Badge to prevent rewarding the goal state */}

      {/* The "Outer Tray" Frame */}
      <div 
        className="relative bg-slate-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2rem] p-4 border-[12px] border-slate-800"
      >
        {/* The Play Surface (Inner Tray) */}
        <div 
          className="relative bg-[#f8fafc] rounded-xl overflow-visible shadow-inner"
          style={{
            width: innerWidth + BOARD_PADDING * 2,
            height: innerHeight + BOARD_PADDING * 2,
            padding: BOARD_PADDING,
          }}
        >
          {/* Grid Layer */}
          <div className="relative w-full h-full">
            {gridCells}
            
            {/* Minimalist Goal Guide - Subtle indicator without text */}
            <div 
              className="absolute bottom-0 left-[84px] w-[168px] h-[84px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl pointer-events-none"
              style={{ opacity: 0.3 }}
            />

            {/* Pieces Layer */}
            {pieces.map((piece) => (
              <PieceComponent
                key={piece.id}
                piece={piece}
                onMove={(dir) => onMovePiece(piece.id, dir)}
                isSolved={isSolved}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Instruction */}
      <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest opacity-60">
        Continuous Sliding Mode • R to Reset
      </p>
    </div>
  );
};

export default Board;
