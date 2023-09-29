import { ArrayIndexProvider } from './array-index-provider';

export const randomArrayIndexProvider: ArrayIndexProvider = (arrayLength: number) =>
  Math.floor(arrayLength * Math.random());
