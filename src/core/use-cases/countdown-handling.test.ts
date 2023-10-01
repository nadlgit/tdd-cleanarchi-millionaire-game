import { StubTimerProvider } from '../../gateways/stub-timer-provider';
import { startCountdown } from '../countdown/start-countdown';
import { stopCountdown } from '../countdown/stop-countdown';
import { type TimerId } from '../countdown/timer-provider';
import { type AppState, initTestStore } from '../store';

describe('Countdown', () => {
  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakeCountdownSeconds?: number;
    fakeNextTimerId?: number;
    fakeRunningTimerId?: number;
  };
  const initTest = ({
    partialState,
    fakeCountdownSeconds,
    fakeNextTimerId,
    fakeRunningTimerId,
  }: InitTestConfig = {}) => {
    const timerProvider = new StubTimerProvider();
    const store = initTestStore({
      dependencies:
        fakeCountdownSeconds || fakeCountdownSeconds === 0
          ? { timerProvider, countdownSeconds: fakeCountdownSeconds }
          : { timerProvider },
      initialState: partialState,
    });
    const initialState = store.getState();
    if (fakeNextTimerId) {
      timerProvider.setNextTimerId(fakeNextTimerId);
    }
    if (fakeRunningTimerId) {
      timerProvider.addRunningTimer({ timerId: fakeRunningTimerId });
    }
    return {
      store,
      initialState,
      isTimerRunning: (timerId: TimerId) => timerProvider.isRunning(timerId),
      getTimerTickMs: (timerId: TimerId) => timerProvider.getTickMs(timerId),
      tickTimer: (timerId: TimerId) => timerProvider.tick(timerId),
    };
  };

  describe('start', () => {
    it('starts timer', () => {
      const fakeNextTimerId = 1234;
      const { store, isTimerRunning } = initTest({ fakeNextTimerId });
      store.dispatch(startCountdown());
      expect(isTimerRunning(fakeNextTimerId)).toBe(true);
    });

    it('sets tick interval to 1 second', () => {
      const fakeNextTimerId = 1234;
      const { store, getTimerTickMs } = initTest({ fakeNextTimerId });
      store.dispatch(startCountdown());
      expect(getTimerTickMs(fakeNextTimerId)).toEqual(1000);
    });

    it('sets remaining seconds', () => {
      const fakeCountdownSeconds = 10;
      const { store, initialState } = initTest({
        partialState: { countdown: { remainingSeconds: 0, timerId: null } },
        fakeCountdownSeconds,
      });
      store.dispatch(startCountdown());
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: { ...store.getState().countdown, remainingSeconds: fakeCountdownSeconds },
      });
    });

    it('stores timer ID', () => {
      const fakeNextTimerId = 1234;
      const { store, initialState } = initTest({
        partialState: { countdown: { remainingSeconds: 0, timerId: null } },
        fakeNextTimerId,
      });
      store.dispatch(startCountdown());
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: {
          ...store.getState().countdown,
          timerId: fakeNextTimerId,
        },
      });
    });

    it('stops potential previous running timer', () => {
      const fakeRunningTimerId = 1234;
      const fakeNextTimerId = 5678;
      const { store, isTimerRunning } = initTest({
        partialState: { countdown: { remainingSeconds: 2, timerId: fakeRunningTimerId } },
        fakeNextTimerId,
        fakeRunningTimerId,
      });
      store.dispatch(startCountdown());
      expect(isTimerRunning(fakeRunningTimerId)).toBe(false);
    });
  });

  describe('stop', () => {
    it('stops timer', () => {
      const fakeRunningTimerId = 1234;
      const { store, isTimerRunning } = initTest({
        partialState: { countdown: { remainingSeconds: 2, timerId: fakeRunningTimerId } },
      });
      store.dispatch(stopCountdown());
      expect(isTimerRunning(fakeRunningTimerId)).toBe(false);
    });

    it('keeps remaining seconds', () => {
      const { store, initialState } = initTest({
        partialState: { countdown: { remainingSeconds: 2, timerId: 1234 } },
      });
      store.dispatch(stopCountdown());
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: {
          ...store.getState().countdown,
          remainingSeconds: initialState.countdown.remainingSeconds,
        },
      });
    });

    it('clears timer ID', () => {
      const { store, initialState } = initTest({
        partialState: { countdown: { remainingSeconds: 2, timerId: 1234 } },
      });
      store.dispatch(stopCountdown());
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: { ...store.getState().countdown, timerId: null },
      });
    });
  });

  describe('on tick', () => {
    it('updates store', () => {
      const fakeCountdownSeconds = 10;
      const fakeNextTimerId = 1234;
      const { store, initialState, tickTimer } = initTest({
        fakeCountdownSeconds,
        fakeNextTimerId,
      });
      store.dispatch(startCountdown());
      tickTimer(fakeNextTimerId);
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: { remainingSeconds: fakeCountdownSeconds - 1, timerId: fakeNextTimerId },
      });
    });

    it('does not go beyond zero', () => {
      const fakeNextTimerId = 1234;
      const { store, initialState, tickTimer } = initTest({
        fakeCountdownSeconds: 0,
        fakeNextTimerId,
      });
      store.dispatch(startCountdown());
      tickTimer(fakeNextTimerId);
      expect(store.getState()).toEqual({
        ...initialState,
        countdown: { remainingSeconds: 0, timerId: fakeNextTimerId },
      });
    });
  });

  describe('on countdown expiry', () => {
    it('submits an empty answer', () => {
      const fakeNextTimerId = 1234;
      const { store, initialState, tickTimer } = initTest({
        partialState: { currentAnswer: { status: 'correct', givenValue: 'A', correctValue: 'A' } },
        fakeCountdownSeconds: 1,
        fakeNextTimerId,
      });
      store.dispatch(startCountdown());
      tickTimer(fakeNextTimerId);
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer, givenValue: null },
        countdown: { ...store.getState().countdown, remainingSeconds: 0 },
      });
    });
  });
});
