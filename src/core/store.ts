import {
  type StateFromReducersMapObject,
  configureStore,
  createAsyncThunk,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { type Dependencies } from './dependencies';
import pyramid from './pyramid/pyramid-slice';
import currentAnswer from './question/current-answer-slice';
import currentQuestion from './question/current-question-slice';
import { testDefaultDependencies } from './test-default-dependencies';

const reducer = { currentQuestion, currentAnswer, pyramid };

const createAppStore = ({
  dependencies,
  initialState,
}: {
  dependencies: Dependencies;
  initialState?: AppState;
}) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }).prepend(
        createListenerMiddleware({ extra: dependencies }).middleware
      ),
    preloadedState: initialState,
  });

let store: AppStore;

export const initStore = (dependencies: Dependencies) => {
  store = createAppStore({ dependencies });
  return store;
};

export const initTestStore = (config?: {
  dependencies?: Partial<Dependencies>;
  initialState?: Partial<AppState>;
}) => {
  const dependencies = testDefaultDependencies;
  const initialState = createAppStore({ dependencies }).getState();
  store = createAppStore({
    dependencies: { ...dependencies, ...config?.dependencies },
    initialState: { ...initialState, ...config?.initialState },
  });
  return store;
};

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
  extra: Dependencies;
}>();

export type AppState = StateFromReducersMapObject<typeof reducer>;

export type AppStore = ReturnType<typeof createAppStore>;

export type AppDispatch = AppStore['dispatch'];
