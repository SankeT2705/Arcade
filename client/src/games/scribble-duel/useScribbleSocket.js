import { useState, useCallback, useEffect } from 'react';
import { useSocketContext } from '../../app/SocketProvider';

/**
 * Custom hook for Scribble Duel socket events.
 */
export default function useScribbleSocket(roomCode) {
  const { socket, playerId } = useSocketContext();

  const [phase, setPhase] = useState('waiting'); // waiting | drawing | round-end | ended
  const [role, setRole] = useState(null); // 'drawer' | 'guesser'
  const [word, setWord] = useState(null);
  const [hintPattern, setHintPattern] = useState([]);
  const [wordLength, setWordLength] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(6);
  const [timeLimit, setTimeLimit] = useState(90000);
  const [scores, setScores] = useState({});
  const [playerNames, setPlayerNames] = useState({});
  const [guesses, setGuesses] = useState([]);
  const [roundEndData, setRoundEndData] = useState(null);
  const [endData, setEndData] = useState(null);
  const [error, setError] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [incomingStroke, setIncomingStroke] = useState(null);
  const [clearCanvas, setClearCanvas] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleRoundStart = (data) => {
      setPhase('drawing');
      setRole(data.role);
      setWord(data.word);
      setHintPattern(data.hintPattern || []);
      setWordLength(data.wordLength);
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setTimeLimit(data.timeLimit);
      setScores(data.scores || {});
      setPlayerNames(data.playerNames || {});
      setGuesses([]);
      setRoundEndData(null);
      setTimerRunning(true);
      setError(null);
      setClearCanvas((c) => c + 1);
    };

    const handleHintUpdate = ({ hintPattern: newHint }) => {
      setHintPattern(newHint || []);
    };

    const handleStroke = (data) => {
      setIncomingStroke(data.stroke);
    };

    const handleClear = () => {
      setClearCanvas((c) => c + 1);
    };

    const handleGuessResult = ({ guess }) => {
      setGuesses((prev) => [...prev, guess]);
    };

    const handleRoundEnd = (data) => {
      setPhase('round-end');
      setRoundEndData(data);
      setScores(data.scores || {});
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

    socket.on('scribble-duel:round-start', handleRoundStart);
    socket.on('scribble-duel:hint-update', handleHintUpdate);
    socket.on('scribble-duel:stroke', handleStroke);
    socket.on('scribble-duel:clear', handleClear);
    socket.on('scribble-duel:guess-result', handleGuessResult);
    socket.on('scribble-duel:round-end', handleRoundEnd);
    socket.on('scribble-duel:end', handleEnd);
    socket.on('scribble-duel:error', handleError);

    return () => {
      socket.off('scribble-duel:round-start', handleRoundStart);
      socket.off('scribble-duel:hint-update', handleHintUpdate);
      socket.off('scribble-duel:stroke', handleStroke);
      socket.off('scribble-duel:clear', handleClear);
      socket.off('scribble-duel:guess-result', handleGuessResult);
      socket.off('scribble-duel:round-end', handleRoundEnd);
      socket.off('scribble-duel:end', handleEnd);
      socket.off('scribble-duel:error', handleError);
    };
  }, [socket]);

  const startGame = useCallback(
    (rounds = 6) => {
      socket?.emit('scribble-duel:start', { roomCode, rounds });
    },
    [socket, roomCode],
  );

  const sendStroke = useCallback(
    (stroke) => {
      socket?.emit('scribble-duel:stroke', { roomCode, stroke });
    },
    [socket, roomCode],
  );

  const sendClear = useCallback(() => {
    socket?.emit('scribble-duel:clear', { roomCode });
  }, [socket, roomCode]);

  const submitGuess = useCallback(
    (guess) => {
      socket?.emit('scribble-duel:guess', { roomCode, guess });
    },
    [socket, roomCode],
  );

  const playAgain = useCallback(
    (rounds = 6) => {
      socket?.emit('scribble-duel:play-again', { roomCode, rounds });
    },
    [socket, roomCode],
  );

  return {
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
  };
}
