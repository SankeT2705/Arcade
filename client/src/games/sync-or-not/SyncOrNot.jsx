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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 sm:px-6 sm:py-4.5 rounded-3xl border border-black/[0.06] shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-soft">
            <CompassIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-surface-950 leading-tight">
              Sync or Not
            </h2>
            {phase === 'question' || phase === 'reveal' ? (
              <p className="text-xs text-surface-500 font-medium mt-0.5">
                Round {round + 1} of {totalRounds} • Pick your choice
              </p>
            ) : (
              <p className="text-xs text-surface-500 font-medium mt-0.5">
                Friendship choice matching
              </p>
            )}
          </div>
        </div>

        {phase === 'question' && (
          <Timer timeLeft={timeLeft} duration={timeLimit} size="md" />
        )}
      </div>

      {/* Error alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-danger-50 border border-danger-200 text-danger-700 text-xs text-center font-medium shadow-soft"
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
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
            <CompassIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-surface-950 mb-2">Sync or Not</h2>
          <p className="text-surface-600 text-xs sm:text-sm mb-7 leading-relaxed">
            Answer 10 intuitive questions live with your friend to measure your vibe synchronization.
          </p>
          <Button onClick={() => startGame(10)} size="lg" className="w-full font-heading font-bold rounded-2xl shadow-soft">
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
