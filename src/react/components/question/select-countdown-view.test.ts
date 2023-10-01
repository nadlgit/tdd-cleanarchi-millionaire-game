import { initTestStore } from '../../../core/store';
import { selectCountdownView } from './select-countdown-view';

describe('Countdown view selector', () => {
  it('gets countdown view for remaining less than 1 minute', () => {
    const store = initTestStore({
      initialState: { countdown: { remainingSeconds: 2, timerId: null } },
    });
    const countdownView = selectCountdownView(store.getState());
    expect(countdownView).toEqual({ minutes: '00', seconds: '02' });
  });

  it('gets countdown view for remaining between 1 and 100 minutes', () => {
    const store = initTestStore({
      initialState: { countdown: { remainingSeconds: 90, timerId: null } },
    });
    const countdownView = selectCountdownView(store.getState());
    expect(countdownView).toEqual({ minutes: '01', seconds: '30' });
  });

  it('gets countdown view for remaining more than 100 minutes', () => {
    const store = initTestStore({
      initialState: { countdown: { remainingSeconds: 6015, timerId: null } },
    });
    const countdownView = selectCountdownView(store.getState());
    expect(countdownView).toEqual({ minutes: '100', seconds: '15' });
  });
});
