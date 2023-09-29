import {
  type StateFromReducersMapObject,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { type Dependencies } from './dependencies';

const reducer = {
  //
};

const createAppStore = ({ dependencies, initialState }: AppStoreConfig) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }).prepend(
        createListenerMiddleware({ extra: dependencies }).middleware
      ),
    preloadedState: initialState,
  });

let store: AppStore;
export const initStore = (config: AppStoreConfig) => {
  store = createAppStore(config);
  return store;
};

export type AppState = StateFromReducersMapObject<typeof reducer>;

export type AppStoreConfig = { dependencies: Dependencies; initialState?: AppState };

export type AppStore = ReturnType<typeof createAppStore>;

export type AppDispatch = AppStore['dispatch'];
