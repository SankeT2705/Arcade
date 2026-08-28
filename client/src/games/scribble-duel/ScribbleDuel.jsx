import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useScribbleSocket from './useScribbleSocket';
import DrawingCanvas from './DrawingCanvas';
import ColorPalette from './ColorPalette';
import GuesserView from './GuesserView';
import Scoreboard from './Scoreboard';
import Timer from '../../components/Timer';
import Button from '../../components/Button';
import useCountdown from '../../hooks/useCountdown';
import { useRoomContext } from '../../app/RoomContext';
import {
  BrushIcon,
  PlayIcon,
  CheckIcon,
  FlameIcon,
  ClockIcon,
} from '../../components/Icons';

export default function ScribbleDuel({ roomCode }) {
  const navigate = useNavigate();
  const { backToHub } = useRoomContext();

  const {
    phase,
    role,
    word,
    hintPattern,
    wordLength,
    round,
    totalRounds,
    timeLimit,
    scores,
    playerNames,
    guesses,
    roundEndData,
    endData,
    error,
    timerRunning,
    incomingStroke,
    clearCanvas,
    playerId,
    startGame,
    sendStroke,
    sendClear,
    submitGuess,
    playAgain,
  } = useScribbleSocket(roomCode);

  const { timeLeft } = useCountdown(timeLimit, timerRunning);

  const [brushColor, setBrushColor] = useState('#0F172A');
  const [brushWidth, setBrushWidth] = useState(4);
  const [activeTool, setActiveTool] = useState('brush');

  const handleBackToHub = () => {
    backToHub();
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-28">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-5 bg-white p-3.5 sm:px-6 sm:py-4 rounded-3xl border border-black/[0.06] shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center shadow-soft">
            <BrushIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-surface-950 leading-tight">
              Scribble Duel
            </h2>
            {(phase === 'drawing' || phase === 'round-end') && (
              <p className="text-xs text-surface-500 font-medium mt-0.5">
                Round {round + 1} of {totalRounds} •{' '}
                <span className={role === 'drawer' ? 'text-primary-700 font-bold' : 'text-rose-700 font-bold'}>
                  {role === 'drawer' ? 'You are Drawing' : 'You are Guessing'}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Score Badges */}
          {phase !== 'waiting' && phase !== 'ended' && (
            <div className="flex items-center gap-2 bg-surface-100 px-3.5 py-1.5 rounded-2xl border border-black/[0.04] text-xs shadow-soft">
              {Object.entries(scores).map(([pid, score]) => (
                <div key={pid} className="flex items-center gap-1.5">
                  <span className="text-surface-500 font-medium truncate max-w-[70px]">
                    {pid === playerId ? 'You' : playerNames[pid]?.split(' ')[0]}:
                  </span>
                  <span className="font-mono font-black text-surface-950">{score}</span>
                </div>
              ))}
            </div>
          )}

          {/* Round Timer */}
          {phase === 'drawing' && (
            <Timer timeLeft={timeLeft} duration={timeLimit} size="sm" />
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 rounded-2xl bg-danger-50 border border-danger-200 text-danger-700 text-xs text-center font-medium shadow-soft"
        >
          {error}
        </motion.div>
      )}

      {/* Waiting Phase */}
      {phase === 'waiting' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 card-surface max-w-md mx-auto p-8 rounded-3xl shadow-card"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
            <BrushIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-surface-950 mb-2">Scribble Duel</h2>
          <p className="text-surface-600 text-xs sm:text-sm mb-7 leading-relaxed">
            Take turns drawing and guessing words against the clock! Fast guesses earn higher bonus points.
          </p>
          <Button onClick={() => startGame(6)} size="lg" className="w-full font-heading font-bold rounded-2xl shadow-soft">
            <PlayIcon className="w-4 h-4" />
            <span>Start 6 Rounds</span>
          </Button>
        </motion.div>
      )}

      {/* Active Drawing Phase */}
      <AnimatePresence mode="wait">
        {phase === 'drawing' && (
          <motion.div
            key={`round-${round}-${role}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {role === 'drawer' ? (
              /* Drawer View */
              <div className="space-y-4">
                {/* Word to Draw Banner */}
                <div className="text-center bg-white p-4 rounded-3xl border border-black/[0.06] shadow-card">
                  <span className="text-xs text-surface-400 font-heading font-bold uppercase tracking-widest block mb-1">
                    Your Secret Word to Draw
                  </span>
                  <span className="text-3xl font-heading font-black text-primary-700 uppercase tracking-widest">
                    {word}
                  </span>
                </div>

                {/* Toolbar */}
                <div className="card-surface !p-3">
                  <ColorPalette
                    selectedColor={brushColor}
                    onColorChange={setBrushColor}
                    selectedWidth={brushWidth}
                    onWidthChange={setBrushWidth}
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    onClear={sendClear}
                  />
                </div>

                {/* Main Drawing Canvas */}
                <DrawingCanvas
                  isDrawer={true}
                  onStroke={sendStroke}
                  incomingStroke={incomingStroke}
                  clearSignal={clearCanvas}
                  color={brushColor}
                  brushWidth={brushWidth}
                  activeTool={activeTool}
                />

                {/* Drawer's Live Guess Feed */}
                {guesses.length > 0 && (
                  <div className="card-surface p-4 space-y-2 max-h-32 overflow-y-auto">
                    <p className="text-[11px] text-surface-400 uppercase tracking-widest font-heading font-bold">
                      Friend&apos;s Guesses:
                    </p>
                    {guesses.map((g, i) => (
                      <div
                        key={i}
                        className={`text-xs px-3 py-1.5 rounded-xl flex items-center justify-between font-medium ${
                          g.isCorrect
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold'
                            : g.isClose
                              ? 'text-amber-700 bg-amber-50 border border-amber-200 font-bold'
                              : 'text-surface-800 bg-surface-100'
                        }`}
                      >
                        <span>{g.playerName}: {g.text}</span>
                        {g.isCorrect && (
                          <span className="font-bold flex items-center gap-1 text-emerald-700">
                            <CheckIcon className="w-3.5 h-3.5" /> Correct!
                          </span>
                        )}
                        {g.isClose && !g.isCorrect && (
                          <span className="font-bold flex items-center gap-1 text-amber-700">
                            <FlameIcon className="w-3.5 h-3.5" /> Very close!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Guesser View */
              <GuesserView
                wordLength={wordLength}
                hintPattern={hintPattern}
                incomingStroke={incomingStroke}
                clearSignal={clearCanvas}
                guesses={guesses}
                onGuess={submitGuess}
                disabled={guesses.some((g) => g.isCorrect)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round End Modal / Overlay */}
      {phase === 'round-end' && roundEndData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-surface p-7 sm:p-9 max-w-md mx-auto text-center space-y-4 shadow-modal"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto shadow-soft">
            <CheckIcon className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-heading font-extrabold text-surface-950">
            {roundEndData.guessedCorrectly ? 'Word Guessed!' : "Time's Up!"}
          </h3>

          <p className="text-xs text-surface-500">
            The word was{' '}
            <span className="font-heading font-black text-primary-700 uppercase tracking-wider text-sm">
              {roundEndData.word}
            </span>
          </p>

          {roundEndData.guessedCorrectly && (
            <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
              <ClockIcon className="w-4 h-4 text-emerald-600" />
              <span>
                Guessed in {Math.round(roundEndData.timeTaken / 1000)}s (+{roundEndData.points} pts)
              </span>
            </div>
          )}

          <div className="pt-2 text-xs text-surface-400 font-medium animate-pulse">
            {roundEndData.isLastRound ? 'Calculating final winner…' : 'Next round starting soon…'}
          </div>
        </motion.div>
      )}

      {/* Final Game Scoreboard */}
      {phase === 'ended' && endData && (
        <Scoreboard
          endData={endData}
          playerId={playerId}
          onPlayAgain={() => playAgain(6)}
          onBackToHub={handleBackToHub}
        />
      )}
    </div>
  );
}
