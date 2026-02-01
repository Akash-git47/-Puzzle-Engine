
import React, { useState, useCallback, useEffect } from 'react';
import { Piece, Direction, GameState } from './types';
import { getInitialPieces, canMove, checkWin } from './logic/gameLogic';
import Board from './components/Board';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    pieces: getInitialPieces(),
    moves: 0,
    isSolved: false,
    history: [],
  });

  const handleMovePiece = useCallback((pieceId: string, requestedDir?: Direction) => {
    setGameState(prev => {
      const pieces = [...prev.pieces];
      const pieceIdx = pieces.findIndex(p => p.id === pieceId);
      if (pieceIdx === -1) return prev;

      const piece = pieces[pieceIdx];
      
      const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      let chosenDir: Direction | null = null;

      if (requestedDir && canMove(piece, requestedDir, pieces)) {
        chosenDir = requestedDir;
      } 
      else if (!requestedDir) {
        const validDirs = directions.filter(d => canMove(piece, d, pieces));
        if (validDirs.length > 0) {
          chosenDir = validDirs[0];
        }
      }

      if (!chosenDir) return prev;

      const newPiece = { ...piece };
      if (chosenDir === 'UP') newPiece.y -= 1;
      else if (chosenDir === 'DOWN') newPiece.y += 1;
      else if (chosenDir === 'LEFT') newPiece.x -= 1;
      else if (chosenDir === 'RIGHT') newPiece.x += 1;

      const newPieces = pieces.map(p => p.id === pieceId ? newPiece : p);
      const solved = checkWin(newPieces);

      return {
        ...prev,
        pieces: newPieces,
        moves: prev.moves + 1,
        isSolved: solved,
        history: [...prev.history, prev.pieces],
      };
    });
  }, []);

  const resetGame = () => {
    setGameState({
      pieces: getInitialPieces(),
      moves: 0,
      isSolved: false,
      history: [],
    });
  };

  const undoMove = () => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const lastPieces = newHistory.pop()!;
      return {
        ...prev,
        pieces: lastPieces,
        moves: prev.moves - 1,
        history: newHistory,
        isSolved: checkWin(lastPieces),
      };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetId = 'target-red';
      if (e.key === 'ArrowUp') handleMovePiece(targetId, 'UP');
      else if (e.key === 'ArrowDown') handleMovePiece(targetId, 'DOWN');
      else if (e.key === 'ArrowLeft') handleMovePiece(targetId, 'LEFT');
      else if (e.key === 'ArrowRight') handleMovePiece(targetId, 'RIGHT');
      else if (e.key === 'r' || e.key === 'R') resetGame();
      else if ((e.metaKey || e.ctrlKey) && e.key === 'z') undoMove();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMovePiece]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Light Design Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Content Container (Ensure it stays above background) */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic drop-shadow-sm">
            KNOT<span className="text-red-600">SLIDE</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Dissection Puzzle Engine</p>
        </div>

        {/* Stats Bar */}
        <div className="w-full max-w-sm flex justify-between items-center mb-8 px-6 py-4 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/50 rounded-2xl border border-white">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Move Count</span>
            <span className="text-3xl font-mono font-black text-slate-800 leading-none">{gameState.moves}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={undoMove}
              disabled={gameState.history.length === 0}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 disabled:opacity-30 transition-all active:scale-90"
              title="Undo (Ctrl+Z)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button 
              onClick={resetGame}
              className="w-12 h-12 flex items-center justify-center bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all active:scale-90 shadow-lg shadow-slate-300"
              title="Reset (R)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Game Board */}
        <Board 
          pieces={gameState.pieces} 
          onMovePiece={handleMovePiece} 
          isSolved={gameState.isSolved}
        />

        {/* Footer Info */}
        <div className="mt-10 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Classic Mechanics • MIN</p>
        </div>
      </div>
    </div>
  );
};

export default App;
