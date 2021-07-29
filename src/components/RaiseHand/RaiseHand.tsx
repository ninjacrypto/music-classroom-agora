import React from 'react';
import styles from './raisehand.module.scss';
interface RaiseHandvisibilityInterface {
  visibility: Boolean;
}
function RaiseHand(props: RaiseHandvisibilityInterface) {
  return (
    props.visibility && (
      <div className={styles.container}>
        <img src='../assets/raisehand.png' alt='' style={{ width: '100%', height: '100%' }} />
      </div>
    )
  );
}

export default RaiseHand;
