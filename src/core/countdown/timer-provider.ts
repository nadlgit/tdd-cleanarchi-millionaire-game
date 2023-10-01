export type TimerId = number;

export type TimerProvider = {
  start: (tickMs: number, onTick: () => void) => TimerId;
  stop: (timerId: TimerId) => void;
};
