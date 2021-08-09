import React, { useState, useEffect, ChangeEvent } from 'react';
import { RootState } from '../../store/store';
import { replaceApploginScreen, replacePassword, replaceUsername } from '../../slices/startSlice';
import { replacedisplayUsername } from '../../slices/joinSlice';
import { replaceChannelName } from '../../slices/userVideoSlice';
import styles from './start.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { useAlert } from 'react-alert';

function Start(props: RouteComponentProps) {
  const { clicked, username, password } = useSelector((state: RootState) => state.start);
  const { channel } = useSelector((state: RootState) => state.meeting);
  const dispatch = useDispatch();
  const alert = useAlert();

  const clearForm = () => {
    dispatch(replaceUsername(''));
    dispatch(replacePassword(''));
  };

  useEffect(() => {
    return () => {
      clearForm();
    };
  }, []);

  const handleReplaceLoginScreenWithStartScreen = () => {
    dispatch(replaceApploginScreen());
  };

  const handleInputChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const { value, name } = target;
    switch (name) {
      case 'username':
        dispatch(replaceUsername(value));
        const data = { displayUsername: 'Admin', type: 'admin' };
        dispatch(replacedisplayUsername(data));
        break;
      case 'password':
        dispatch(replacePassword(value));
        break;
      case 'channelname':
        dispatch(replaceChannelName(value));
        break;
    }
  };
  const handleStartClick = () => {
    if (username === 'admin' && password === 'Qwertyuiop!') {
      alert.show('Login successfully', { type: 'success' });
      props.history.push('/meeting');
    } else {
      alert.show('Invalid Credentials', { type: 'error' });
    }
  };

  const handleLoginFormrender = () => {
    if (clicked) {
      return (
        <div className={styles.STaccessContainer}>
          <div className={styles.STaccess1}>Studio Access</div>
          <div className={styles.inputContainer}>
            <input name='username' type='text' value={username} placeholder='Username' onChange={handleInputChange} />
            <input name='password' type='password' value={password} placeholder='Password' onChange={handleInputChange} />
            <input name='channelname' type='text' value={channel} placeholder='Room ID' onChange={handleInputChange} />
          </div>
          <div onClick={handleStartClick}>
            <img style={{ cursor: 'pointer' }} src='./assets/loginbtn.png' alt='' />
          </div>
          <div className={styles.forgotPassword}>Forgot Password</div>
          <div style={{ textAlign: 'center' }}>
            <div className={styles.Register}>Register </div>
            <div className={styles.Register_sub_text}>as New User</div>
          </div>
        </div>
      );
    } else {
      return (
        <div onClick={handleReplaceLoginScreenWithStartScreen} className={styles.STaccess}>
          <div className={styles.arrow_container}>
            <div className={styles.arrow_down}></div>
          </div>
          <div className={styles.STaccessText}>Studio Access</div>
        </div>
      );
    }
  };
  return handleLoginFormrender();
}

export default Start;
