import React, { useEffect } from 'react';
import styles from './join.module.scss';
import Home from '../Home/Home';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { replaceChannelName } from '../../slices/userVideoSlice';
import { RootState } from '../../store/store';
import { replaceChildName, replacedisplayUsername, replaceGuestName, replaceParentName } from '../../slices/joinSlice';
import useAlertService from '../../hooks/AlertService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Join(props: RouteComponentProps) {
  const query = useQuery();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const alertService = useAlertService();
  useEffect(() => {
    const channelName = query.get('id');
    if (channelName) {
      dispatch(replaceChannelName(channelName));
    }
  }, []);

  const handleInputChange = (eventName: any) => {
    const { name, value } = eventName.target;
    switch (name) {
      case 'join':
        dispatch(replaceChannelName(value));
        break;
      case 'guest':
        dispatch(replaceGuestName({ guestname: value, type: 'user' }));
        break;
      case 'parent':
        dispatch(replaceParentName({ parentname: value, type: 'user' }));
        break;
      case 'child':
        dispatch(replaceChildName({ childname: value, type: 'user' }));
        break;
    }
  };

  const handleOnJoinClick = () => {
    if (state.meeting.channel && (state.join.childname || state.join.guestname || state.join.parentname)) {
      props.history.push('/meeting');
    } else {
      return;
    }
  };

  return (
    <div>
      <Home>
        <div className={styles.STaccessContainer}>
          <div className={styles.STaccess1}>Studio Access</div>
          <div className={styles.inputContainer}>
            <input
              name='join'
              type='text'
              style={{ height: '30px', textAlign: 'center' }}
              value={state.meeting.channel}
              placeholder='Meeting ID'
              onChange={handleInputChange}
            />
          </div>
          <div>
            <div className={styles.STaccess2}>Who is attending ?</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <input
              name='parent'
              type='text'
              style={{ height: '30px', textAlign: 'center' }}
              value={state.join.parentname}
              placeholder='Parent/guardian First Name'
              onChange={handleInputChange}
            />
            <input
              name='child'
              type='text'
              style={{ height: '30px', textAlign: 'center' }}
              value={state.join.childname}
              placeholder='Child First Name'
              onChange={handleInputChange}
            />
            <input
              name='guest'
              type='text'
              style={{ height: '30px', textAlign: 'center' }}
              value={state.join.guestname}
              placeholder='Guest First Name'
              onChange={handleInputChange}
            />
            <img style={{ cursor: 'pointer', marginTop: '20px' }} src='./assets/loginbtn.png' alt='' onClick={handleOnJoinClick} />
          </div>
        </div>
      </Home>
    </div>
  );
}

export default Join;
