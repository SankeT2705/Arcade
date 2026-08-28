import { useState, useCallback, useEffect } from 'react';
import { useSocketContext } from '../../app/SocketProvider';

/**
 * Custom hook for Sync or Not socket events.
 * Encapsulates all game-specific socket communication.
 */
export default function useSyncOrNotSocket(roomCode) {
  const { socket, playerId } = useSocketContext();

  const [phase, setPhase] = useState('waiting'); // waiting | question | reveal | ended
  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30000);
  const [myAnswer, setMyAnswer] = useState(null);
  const [revealData, setRevealData] = useState(null);
  const [endData, setEndData] = useState(null);
  const [error, setError] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleRound = (data) => {
      setPhase('question');
      setQuestion(data.question);
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setTimeLimit(data.timeLimit);
      setMyAnswer(null);
      setRevealData(null);
      setTimerRunning(true);
      setError(null);
    };

    const handleAnswerAck = ({ answer }) => {
      setMyAnswer(answer);
    };

    const handleReveal = (data) => {
      setPhase('reveal');
      setRevealData(data);
      setTimerRunning(false);
    };

    const handleEnd = (data) => {
      setPhase('ended');
      setEndData(data);
      setTimerRunning(false);
    };

    const handleError = ({ message }) => {
      setError(message);
    };

    socket.on('sync-or-not:round', handleRound);
    socket.on('sync-or-not:answer-ack', handleAnswerAck);
    socket.on('sync-or-not:reveal', handleReveal);
    socket.on('sync-or-not:end', handleEnd);
    socket.on('sync-or-not:error', handleError);

    return () => {
      socket.off('sync-or-not:round', handleRound);
      socket.off('sync-or-not:answer-ack', handleAnswerAck);
      socket.off('sync-or-not:reveal', handleReveal);
      socket.off('sync-or-not:end', handleEnd);
      socket.off('sync-or-not:error', handleError);
    };
  }, [socket]);

  const startGame = useCallback(
    (rounds = 10) => {
      socket?.emit('sync-or-not:start', { roomCode, rounds });
    },
    [socket, roomCode],
  );

  const submitAnswer = useCallback(
    (answer) => {
      if (!myAnswer) {
        socket?.emit('sync-or-not:answer', { roomCode, answer });
      }
    },
    [socket, roomCode, myAnswer],
  );

  const nextRound = useCallback(() => {
    socket?.emit('sync-or-not:next', { roomCode });
  }, [socket, roomCode]);

  const playAgain = useCallback(
    (rounds = 10) => {
      setPhase('waiting');
      setEndData(null);
      setRevealData(null);
      socket?.emit('sync-or-not:play-again', { roomCode, rounds });
    },
    [socket, roomCode],
  );

  return {
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
  };
}
