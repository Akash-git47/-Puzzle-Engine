
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
            
            {/* Minimalist Goal Guide - Elegant explicit destination slot */}
            <div 
              className="absolute bottom-0 left-[84px] w-[168px] h-[84px] p-2 bg-red-50/10 border-2 border-dashed border-red-400/40 rounded-xl pointer-events-none flex flex-col items-center justify-center transition-all duration-300"
              style={{ opacity: isSolved ? 0.9 : 0.6 }}
            >
              <span className="text-[10px] text-red-500 font-black tracking-[0.2em] uppercase">EXIT GATE</span>
              <span className="text-[8px] text-red-400/70 font-black uppercase tracking-widest text-center mt-0.5 leading-none">
                Goal Destination
              </span>
            </div>

            {/* Pieces Layer */}
            {pieces.map((piece) => (
              <PieceComponent
                key={piece.id}
                piece={piece}
                onMove={(dir) => onMovePiece(piece.id, dir)}
                isSolved={isSolved}
              />
            ))}

            {/* Victory Overlay covers the game board when solved */}
            {isSolved && (
              <div className="absolute inset-x-0 inset-y-0 z-50 bg-slate-950/85 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-4 animate-fade-in border border-white/10 shadow-2xl">
                <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 mb-3 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Puzzle Solved!</h3>
                <p className="text-slate-300 text-[11px] mt-1 max-w-[240px] leading-relaxed font-medium">
                  The red target block successfully reached the bottom-center exit gate!
                </p>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Escape Succeeded</span>
                </div>
              </div>
            )}
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
