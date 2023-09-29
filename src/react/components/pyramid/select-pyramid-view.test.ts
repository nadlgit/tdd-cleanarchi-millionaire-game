import { initTestStore } from '../../../core/store';
import { selectPyramidView } from './select-pyramid-view';

describe('Pyramid view selector', () => {
  it('gets pyramid view', () => {
    const store = initTestStore({
      initialState: {
        pyramid: {
          values: ['10 €', '50 €', '100 €', '500 €'],
          milestones: ['50 €'],
          currentValue: '10 €',
          currentMilestone: null,
        },
      },
    });
    const pyramidView = selectPyramidView(store.getState());
    expect(pyramidView).toEqual([
      { label: '500 €', isMilestone: true, isCurrent: false },
      { label: '100 €', isMilestone: false, isCurrent: false },
      { label: '50 €', isMilestone: true, isCurrent: false },
      { label: '10 €', isMilestone: false, isCurrent: true },
    ]);
  });
});
