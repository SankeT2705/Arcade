import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSyncOrNotSocket from './useSyncOrNotSocket';
import QuestionCard from './QuestionCard';
import RevealScreen from './RevealScreen';
import SummaryScreen from './SummaryScreen';
import Timer from '../../components/Timer';
import Button from '../../components/Button';
import useCountdown from '../../hooks/useCountdown';
import { useRoomContext } from '../../app/RoomContext';
import { CompassIcon, PlayIcon } from '../../components/Icons';

export default function SyncOrNot({ roomCode }) {
  const navigate = useNavigate();
  const { backToHub } = useRoomContext();

  const {
    phase,
    question,
    round,
    totalRounds,
    timeLimit,
    myAnswer,
    revealData,
    endData,
    error,
    timerRunning,
    playerId,
    startGame,
    submitAnswer,
    nextRound,
    playAgain,
  } = useSyncOrNotSocket(roomCode);

  const { timeLeft } = useCountdown(timeLimit, timerRunning);

  const handleBackToHub = () => {
    backToHub();
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-3.5 sm:px-5 sm:py-4 rounded-2xl border border-surface-200 shadow-architect">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary-600 flex items-center justify-center shadow-xs">
            <CompassIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-surface-950 leading-tight">
              Sync or Not
            </h2>
            {phase === 'question' || phase === 'reveal' ? (
              <p className="text-[11px] text-surface-500">
                Round {round + 1} of {totalRounds} • Select your preference
              </p>
            ) : null}
          </div>
        </div>

        {phase === 'question' && (
          <Timer timeLeft={timeLeft} duration={timeLimit} size="sm" />
        )}
      </div>

      {/* Error alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
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
          className="text-center py-12 glass-card border border-surface-200 max-w-md mx-auto p-8 rounded-2xl shadow-architect"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary-50 border border-secondary-200 text-secondary-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CompassIcon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-surface-950 mb-2">Sync or Not</h2>
          <p className="text-surface-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Answer 10 intuitive questions live with your friend to measure your vibe synchronization.
          </p>
          <Button onClick={() => startGame(10)} size="lg" className="w-full font-heading font-bold">
            <PlayIcon className="w-4 h-4" />
            <span>Start 10 Rounds</span>
          </Button>
        </motion.div>
      )}

      {/* Question phase */}
      {phase === 'question' && question && (
        <motion.div
          key={`q-${round}`}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.25 }}
        >
          <QuestionCard
            question={question}
            onAnswer={submitAnswer}
            myAnswer={myAnswer}
            disabled={!!myAnswer}
          />
        </motion.div>
      )}

      {/* Reveal phase */}
      {phase === 'reveal' && revealData && (
        <RevealScreen
          data={revealData}
          playerId={playerId}
          onNext={nextRound}
        />
      )}

      {/* End phase */}
      {phase === 'ended' && endData && (
        <SummaryScreen
          data={endData}
          onPlayAgain={() => playAgain(10)}
          onBackToHub={handleBackToHub}
        />
      )}
    </div>
  );
}
