import { createListenerMiddleware } from '@reduxjs/toolkit';
import { type Dependencies } from '../dependencies';

export const createAppListenerMiddleware = (dependencies: Dependencies) => {
  const listener = createListenerMiddleware({ extra: dependencies });
  return listener.middleware;
};
