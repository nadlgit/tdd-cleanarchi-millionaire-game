import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../../core/store';
import { appDependencies } from './app-dependencies';

export const AppStoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={initStore(appDependencies)}>{children}</Provider>
);
