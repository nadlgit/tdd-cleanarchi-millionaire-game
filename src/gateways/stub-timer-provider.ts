import { type TimerId, type TimerProvider } from '../core/countdown/timer-provider';

export class StubTimerProvider implements TimerProvider {
  private _runningTimers = new Map<TimerId, { tickMs: number; onTick: () => void }>();
  private _nextTimerId: number = 0;

  start(tickMs: number, onTick: () => void) {
    this.addRunningTimer({ timerId: this._nextTimerId, tickMs, onTick });
    return this._nextTimerId;
  }

  stop(timerId: TimerId) {
    this._runningTimers.delete(timerId);
  }

  setNextTimerId(id: TimerId) {
    this._nextTimerId = id;
  }

  isRunning(timerId: TimerId) {
    return this._runningTimers.has(timerId);
  }

  getTickMs(timerId: TimerId) {
    return this._runningTimers.get(timerId)?.tickMs;
  }

  addRunningTimer({
    timerId,
    tickMs = 0,
    onTick = () => null,
  }: {
    timerId: TimerId;
    tickMs?: number;
    onTick?: () => void;
  }) {
    this._runningTimers.set(timerId, { tickMs, onTick });
  }

  tick(timerId: TimerId) {
    const onTick = this._runningTimers.get(timerId)?.onTick;
    if (onTick) {
      onTick();
    }
  }
}
