import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../core/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
