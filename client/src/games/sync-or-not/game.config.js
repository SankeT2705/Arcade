export default {
  id: 'sync-or-not',
  name: 'Sync or Not',
  description: 'Pick the same answer as your friend — are you in sync?',
  icon: 'compass',
  minPlayers: 2,
  maxPlayers: 2,
  component: () => import('./SyncOrNot'),
};
