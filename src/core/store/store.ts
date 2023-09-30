import {
  type StateFromReducersMapObject,
  configureStore,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { type Dependencies } from '../dependencies';
import { createAppListenerMiddleware } from './listener-middleware';
import { rootReducer } from './root-reducer';
import { testDefaultDependencies } from './test-default-dependencies';

const createAppStore = ({
  dependencies,
  initialState,
}: {
  dependencies: Dependencies;
  initialState?: AppState;
}) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }).prepend(
        createAppListenerMiddleware(dependencies)
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

export type AppState = StateFromReducersMapObject<typeof rootReducer>;

export type AppStore = ReturnType<typeof createAppStore>;

export type AppDispatch = AppStore['dispatch'];
