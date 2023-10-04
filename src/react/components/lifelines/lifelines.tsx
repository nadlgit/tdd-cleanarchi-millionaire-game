import { applyFiftyLifeline } from '../../../core/use-cases/apply-fifty-lifeline';
import { useAppDispatch } from '../../store/use-app-dispatch';
import { useAppSelector } from '../../store/use-app-selector';

export const Lifelines = () => {
  const dispatch = useAppDispatch();
  const isFiftyLifelineUsed = useAppSelector((state) => !!state.fiftyLifeline);
  return (
    <div className="lifelines">
      <button
        className="lifeline"
        onClick={() => dispatch(applyFiftyLifeline())}
        disabled={isFiftyLifelineUsed}
      >
        50:50
      </button>
    </div>
  );
};
