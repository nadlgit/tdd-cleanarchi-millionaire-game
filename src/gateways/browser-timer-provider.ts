import { type TimerId, type TimerProvider } from '../core/countdown/timer-provider';

export class BrowserTimerProvider implements TimerProvider {
  start(tickMs: number, onTick: () => void) {
    return window.setInterval(onTick, tickMs);
  }

  stop(timerId: TimerId) {
    window.clearInterval(timerId);
  }
}
