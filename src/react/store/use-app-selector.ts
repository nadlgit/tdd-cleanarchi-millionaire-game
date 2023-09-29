import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import { type AppState } from '../../core/store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
