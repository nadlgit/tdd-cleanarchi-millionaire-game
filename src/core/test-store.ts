import { type AppStoreConfig, initStore } from './store';

export const initTestStore = (config?: {
  dependencies?: Partial<AppStoreConfig['dependencies']>;
  initialState?: Partial<AppStoreConfig['initialState']>;
}) => {
  const dependencies = {
    //
  };

  const initialState = initStore({ dependencies }).getState();

  return initStore({
    dependencies: { ...dependencies, ...config?.dependencies },
    initialState: { ...initialState, ...config?.initialState },
  });
};
