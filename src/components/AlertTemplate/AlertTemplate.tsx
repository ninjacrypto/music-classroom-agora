const alertStyle = {
  backgroundColor: '#ffffff',
  color: 'black',
  padding: '10px',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  boxSizing: 'border-box',
  fontSize: '14px',
};

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};

export interface AlertTemplateInterface {
  message: string;
  options: any;
  style: any;
  close: any;
}

const AlertTemplate = ({ message, options, style, close }: AlertTemplateInterface) => {
  return (
    <div style={{ ...style, ...alertStyle }}>
      <div>
        {options.type === 'info' && <img src='/assets/info.png' height={20} width={20} alt='' />}
        {options.type === 'success' && <img src='/assets/success.png' height={20} width={20} alt='' />}
        {options.type === 'error' && <img src='/assets/error.png' height={20} width={20} alt='' />}
      </div>
      <span style={{ flex: 2 }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <img src='/assets/cancel.svg' height={10} width={20} alt='' />
      </button>
    </div>
  );
};

export default AlertTemplate;
