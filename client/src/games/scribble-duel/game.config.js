export default {
  id: 'scribble-duel',
  name: 'Scribble Duel',
  description: 'Draw, guess, and outscore your friend!',
  icon: 'brush',
  minPlayers: 2,
  maxPlayers: 2,
  component: () => import('./ScribbleDuel'),
};
