import { createSlice } from '@reduxjs/toolkit';
import { type GameStatus } from './game-status';

const initialState = 'PLAYING' as GameStatus;

const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState,
  reducers: {
    setVictory: () => 'VICTORY' as GameStatus,
    setGameOver: () => 'GAME_OVER' as GameStatus,
  },
});

export default gameStatusSlice.reducer;

export const { setVictory, setGameOver } = gameStatusSlice.actions;
