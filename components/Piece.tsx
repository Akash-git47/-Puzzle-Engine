
import React, { useRef, useState } from 'react';
import { Piece, PieceType, Direction } from '../types';
import { CELL_SIZE, PIECE_GAP } from '../constants';

interface PieceProps {
  piece: Piece;
  onMove: (direction: Direction) => void;
  isSolved: boolean;
}

const DRAG_THRESHOLD = 30;

const PieceComponent: React.FC<PieceProps> = ({ piece, onMove, isSolved }) => {
  const isTarget = piece.type === PieceType.TARGET;
  const dragStart = useRef<{ x: number, y: number } | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Removed isSolved check to allow free movement indefinitely
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsPressed(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Removed isSolved check
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    let moveDir: Direction | null = null;

    if (Math.abs(dx) > DRAG_THRESHOLD) {
      moveDir = dx > 0 ? 'RIGHT' : 'LEFT';
    } else if (Math.abs(dy) > DRAG_THRESHOLD) {
      moveDir = dy > 0 ? 'DOWN' : 'UP';
    }

    if (moveDir) {
      onMove(moveDir);
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragStart.current = null;
    setIsPressed(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute transition-all duration-200 cursor-grab active:cursor-grabbing rounded-xl select-none flex items-center justify-center group touch-none
        ${isTarget ? 'z-30' : 'z-20'} 
        ${isPressed ? 'scale-[0.98] brightness-105 shadow-sm' : 'scale-100 shadow-md'}
      `}
      style={{
        left: piece.x * CELL_SIZE + PIECE_GAP,
        top: piece.y * CELL_SIZE + PIECE_GAP,
        width: piece.w * CELL_SIZE - PIECE_GAP * 2,
        height: piece.h * CELL_SIZE - PIECE_GAP * 2,
        backgroundColor: piece.color,
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.4),
          inset 0 -4px 6px rgba(0,0,0,0.1),
          0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
        `,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />
      
      {isTarget ? (
        <div className="flex flex-col items-center pointer-events-none">
           <span className="text-white font-black text-xs uppercase tracking-[0.2em] drop-shadow-md">Target</span>
           <div className="flex gap-1.5 mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
           </div>
        </div>
      ) : (
        <div className="flex items-center justify-center pointer-events-none opacity-30">
           <div className={`border-2 border-white/60 rounded-full ${piece.type === PieceType.OBSTACLE_RECT ? 'w-4 h-12' : 'w-6 h-6'}`} />
        </div>
      )}

      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none" />
    </div>
  );
};

export default PieceComponent;
