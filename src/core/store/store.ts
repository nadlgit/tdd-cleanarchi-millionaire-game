import {
  type AnyAction,
  type ListenerMiddlewareInstance,
  type StateFromReducersMapObject,
  type ThunkAction,
  type ThunkDispatch,
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

export type AppState = StateFromReducersMapObject<typeof rootReducer>;

export type AppStore = ReturnType<typeof createAppStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  Dependencies,
  AnyAction
>;

export type CreateAppAsyncThunk = ReturnType<
  typeof createAsyncThunk.withTypes<{
    state: AppState;
    dispatch: AppDispatch;
    extra: Dependencies;
  }>
>;

export type AppListenerMiddlewareInstance = ListenerMiddlewareInstance<
  AppState,
  ThunkDispatch<AppState, Dependencies, AnyAction>,
  Dependencies
>;
