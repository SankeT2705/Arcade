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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white p-3 sm:px-5 sm:py-3.5 rounded-2xl border border-surface-200 shadow-architect">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center text-lg shadow-xs">
            <BrushIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-surface-950 leading-tight">
              Scribble Duel
            </h2>
            {(phase === 'drawing' || phase === 'round-end') && (
              <p className="text-[11px] text-surface-500">
                Round {round + 1} of {totalRounds} •{' '}
                <span className={role === 'drawer' ? 'text-primary-700 font-bold' : 'text-secondary-700 font-bold'}>
                  {role === 'drawer' ? 'You are Drawing' : 'You are Guessing'}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Score Badges */}
          {phase !== 'waiting' && phase !== 'ended' && (
            <div className="flex items-center gap-2 bg-surface-100 px-3 py-1.5 rounded-xl border border-surface-200 text-xs">
              {Object.entries(scores).map(([pid, score]) => (
                <div key={pid} className="flex items-center gap-1.5">
                  <span className="text-surface-500 truncate max-w-[70px]">
                    {pid === playerId ? 'You' : playerNames[pid]?.split(' ')[0]}:
                  </span>
                  <span className="font-mono font-bold text-surface-950">{score}</span>
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
          className="mb-4 p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-xs text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Waiting Phase */}
      {phase === 'waiting' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 glass-card border border-surface-200 max-w-md mx-auto p-8 rounded-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <BrushIcon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-surface-950 mb-2">Scribble Duel</h2>
          <p className="text-surface-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Take turns drawing and guessing words against the clock! Fast guesses earn higher bonus points.
          </p>
          <Button onClick={() => startGame(6)} size="lg" className="w-full font-heading font-bold">
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
            className="space-y-3"
          >
            {role === 'drawer' ? (
              /* Drawer View */
              <div className="space-y-3">
                {/* Word to Draw Banner */}
                <div className="text-center bg-white p-3.5 rounded-2xl border border-surface-200 shadow-architect">
                  <span className="text-[11px] text-surface-500 font-semibold uppercase tracking-wider block mb-0.5">
                    Your Secret Word to Draw
                  </span>
                  <span className="text-2xl font-heading font-black text-primary-700 uppercase tracking-widest">
                    {word}
                  </span>
                </div>

                {/* Toolbar */}
                <div className="glass-card !p-2 sm:!p-3 border border-surface-200">
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
                  <div className="bg-white p-3 rounded-2xl border border-surface-200 space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar shadow-xs">
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider font-bold">
                      Friend&apos;s Guesses:
                    </p>
                    {guesses.map((g, i) => (
                      <div
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-lg flex items-center justify-between ${
                          g.isCorrect
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : g.isClose
                              ? 'text-amber-700 bg-amber-50 border border-amber-200'
                              : 'text-surface-700 bg-surface-50'
                        }`}
                      >
                        <span>{g.playerName}: {g.text}</span>
                        {g.isCorrect && (
                          <span className="font-bold flex items-center gap-1 text-emerald-700">
                            <CheckIcon className="w-3 h-3" /> Correct!
                          </span>
                        )}
                        {g.isClose && !g.isCorrect && (
                          <span className="font-bold flex items-center gap-1 text-amber-700">
                            <FlameIcon className="w-3 h-3" /> Very close!
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

      {/* Round End Results */}
      {phase === 'round-end' && roundEndData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 glass-card max-w-md mx-auto rounded-2xl border border-surface-200 shadow-modal p-6 sm:p-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-3">
            {roundEndData.guessedCorrectly ? (
              <CheckIcon className="w-7 h-7 text-emerald-600" />
            ) : (
              <ClockIcon className="w-7 h-7 text-amber-600" />
            )}
          </div>
          <h3 className="text-2xl font-heading font-bold text-surface-950 mb-1">
            {roundEndData.guessedCorrectly ? 'Guessed Correctly!' : "Time's Up!"}
          </h3>
          <p className="text-surface-600 text-xs sm:text-sm mb-2">
            The word was: <span className="font-bold text-primary-700 font-mono text-base">&quot;{roundEndData.word}&quot;</span>
          </p>
          {roundEndData.guessedCorrectly && (
            <p className="text-emerald-700 font-bold text-base mb-3">
              +{roundEndData.points} Points Awarded
            </p>
          )}
          <p className="text-xs text-surface-500 mt-4 animate-pulse font-medium">
            {roundEndData.isLastRound ? 'Preparing final results…' : 'Next round starting soon…'}
          </p>
        </motion.div>
      )}

      {/* Game End Scoreboard */}
      {phase === 'ended' && endData && (
        <Scoreboard
          data={endData}
          playerId={playerId}
          onPlayAgain={() => playAgain(6)}
          onBackToHub={handleBackToHub}
        />
      )}
    </div>
  );
}
