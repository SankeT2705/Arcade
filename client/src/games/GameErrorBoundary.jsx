import { Component } from 'react';
import Button from '../components/Button';

/**
 * Error boundary for game modules.
 * Catches render errors in individual games without crashing the entire app.
 */
export default class GameErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[GameErrorBoundary] Game crashed:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <span className="text-5xl mb-4 block">💥</span>
          <h2 className="text-xl font-bold text-surface-100 mb-2">Game Crashed</h2>
          <p className="text-surface-400 mb-2">
            Something went wrong in this game, but the rest of the app is fine!
          </p>
          <p className="text-surface-500 text-sm mb-6 font-mono bg-surface-800/50 rounded-lg p-3">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <Button onClick={this.handleReset}>Back to Game Hub</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
