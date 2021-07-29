import { RootState, store } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { replaceMessage, replaceHandleProceed, replaceTimeoutId } from '../slices/alertSlice';

function AlertService() {
  const timeout: number = 5000;
  const dispatch = useDispatch();
  const { timeoutId } = useSelector((state: RootState) => state.alert);

  const clearAutoClose = (): void => {
    clearTimeout(timeoutId);
    dispatch(replaceTimeoutId(0));
  };

  const setAutoClose = (): void => {
    const timeoutId: number = window.setTimeout(() => {
      dispatch(replaceMessage(''));
      clearAutoClose();
    }, timeout);
    dispatch(replaceTimeoutId(timeoutId));
  };

  const push = (message: string, handleProceed?: () => void): void => {
    pull();
    dispatch(replaceMessage(message));
    if (handleProceed) {
      dispatch(replaceHandleProceed(handleProceed));
    } else setAutoClose();
  };

  const pull = () => {
    clearAutoClose();
    dispatch(replaceMessage(''));
    dispatch(replaceHandleProceed(null));
  };

  return {
    clearAutoClose,
    setAutoClose,
    push,
    pull,
  };
}

export default AlertService;
