import { useEffect } from 'react';
import { retrievePyramid } from '../../../core/use-cases/retrieve-pyramid';
import { useAppDispatch } from '../../store/use-app-dispatch';
import { useAppSelector } from '../../store/use-app-selector';
import { selectPyramidView } from './select-pyramid-view';

export const Pyramid = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(retrievePyramid());
  }, [dispatch]);
  const pyramidView = useAppSelector(selectPyramidView);
  return (
    <div className="pyramid">
      {pyramidView.map(({ label, isMilestone, isCurrent }) => (
        <p
          key={label}
          className={
            'pyramid-step' +
            (isMilestone ? ' pyramid-milestone' : '') +
            (isCurrent ? ' pyramid-current' : '')
          }
        >
          {label}
        </p>
      ))}
    </div>
  );
};
