import { StubPyramidGateway } from '../../gateways/stub-pyramid-gateway';
import { type Pyramid } from '../pyramid/pyramid';
import { type AppState, initTestStore } from '../store';
import { retrievePyramid } from './retrieve-pyramid';

describe('Retrieve pyramid', () => {
  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakePyramid?: Pyramid;
  };
  const initTest = ({ partialState, fakePyramid }: InitTestConfig) => {
    const pyramidGateway = new StubPyramidGateway();
    const store = initTestStore({
      dependencies: { pyramidGateway },
      initialState: partialState,
    });
    const initialState = store.getState();
    if (fakePyramid) {
      pyramidGateway.setPyramid(fakePyramid);
    }
    return { store, initialState };
  };

  it('retrieves the pyramid', async () => {
    const pyramid: Pyramid = {
      values: ['10 €', '50 €', '100 €', '500 €'],
      milestones: ['50 €'],
    };
    const { store, initialState } = initTest({
      partialState: {
        pyramid: {
          values: ['1 €'],
          milestones: ['1 €'],
          currentValue: '1 €',
          currentMilestone: '1 €',
        },
      },
      fakePyramid: pyramid,
    });
    await store.dispatch(retrievePyramid());
    expect(store.getState()).toEqual({
      ...initialState,
      pyramid: { ...pyramid, currentValue: null, currentMilestone: null },
    });
  });
});
