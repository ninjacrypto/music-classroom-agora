import React, { useState } from 'react';
import styles from './Accordion.module.scss';
import Collapsible from 'react-collapsible';

function Accordion({ children }: any) {
  const [toggle, setToggle] = useState(false);
  const TrigerElement = (toggle: boolean) => {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <text>Tools</text>
          {toggle ? (
            <img src='./assets/backArrow.png' height={15} width={20} style={{ transform: 'rotate(90deg)' }} alt='' />
          ) : (
            <img src='./assets/backArrow.png' height={15} width={20} alt='' />
          )}
        </div>
        <hr className='horizontal' />
      </>
    );
  };

  return (
    <Collapsible onOpen={() => setToggle(true)} onClose={() => setToggle(false)} trigger={TrigerElement(toggle)}>
      {children}
    </Collapsible>
  );
}

export default Accordion;
