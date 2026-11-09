import { GuessResult } from './core/game.js';

export interface Attempt {
  guess: string;
  result: GuessResult;
}

export interface GameState {
  status: 'settings' | 'playing' | 'won';
  length: number;
  base: number;
  secret: string;
  history: Attempt[];
  startTime: number | null;
}

export const initialGameState: GameState = {
  status: 'settings',
  length: 4,
  base: 10,
  secret: '',
  history: [],
  startTime: null,
};

// Иммутабельное добавление попытки
export const addAttempt = (state: GameState, attempt: Attempt): GameState => {
  return {
    ...state,
    history: [...state.history, attempt], // Создаем новый массив
  };
};

// Иммутабельная установка статуса победы
export const setWinStatus = (state: GameState): GameState => {
  return { ...state, status: 'won' };
};
