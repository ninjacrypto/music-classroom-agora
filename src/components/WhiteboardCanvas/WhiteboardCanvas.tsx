// import { isPlatform } from '@ionic/react';
// import React, { Component } from 'react';
import WhiteboardCanvasService from '../../hooks/Whiteboard/WhiteboardCanvasService';
import React, { useEffect, memo, useRef } from 'react';

interface WhiteboardCanvasProps {
  handleClick: () => void;
}

// export default class WhiteboardCanvas extends Component<WhiteboardCanvasProps> {
//   whiteboardCanvasService: WhiteboardCanvasService;

//   constructor(props: WhiteboardCanvasProps) {
//     super(props);
//     this.whiteboardCanvasService = new WhiteboardCanvasService();
//   }

//   setDimensions() {
//     const width = document.getElementById('newMainContentRightInnerTextarea')?.clientWidth || 700;
//     const mobileHeight = 500;
//     const desktopHeight = document.getElementById('newMainContentRightInnerTextarea')?.clientHeight;
//     const height = desktopHeight ? desktopHeight  : mobileHeight;
//     this.whiteboardCanvasService.setDimensions(width, height);
//   }

//   componentDidMount() {
//     this.whiteboardCanvasService.initialize();
//     this.setDimensions();
//   }

//   render() {
//     return (
//       <div onMouseDown={this.props.handleClick} onTouchStart={this.props.handleClick}>
//         <canvas id='whiteboardCanvas' />
//      </div>
//     );
//   }
// }

function WhiteboardCanvas(props: WhiteboardCanvasProps) {
  const whiteboardCanvasService = new WhiteboardCanvasService();
  const ref = useRef(null);

  const setDimensions = (resizeObserver: any) => {
    //@ts-ignore
    resizeObserver.observe(document.getElementById('newMainContentRightInnerTextarea'));
    // const width = document.getElementById('newMainContentRightInnerTextarea')?.clientWidth || 700;
    // const mobileHeight = 500;
    // const desktopHeight = document.getElementById('newMainContentRightInnerTextarea')?.clientHeight;
    // const height = desktopHeight ? desktopHeight : mobileHeight;
    // whiteboardCanvasService.setDimensions(width, height);
  };

  useEffect(() => {
    const element = document.getElementsByClassName('canvas-container')[0];
    if (element) return;
    whiteboardCanvasService.initialize();
    const desktopHeight = document.getElementById('newMainContentRightInnerTextarea')?.clientHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.map((entry, index) => {
        const ele = entry.contentRect;
        whiteboardCanvasService.setDimensions(ele.width, desktopHeight);
        console.log('>>>>>>>>>> size changes >>>>>>>', ele.height, ele.width);
      });
      // console.log('>>>>>>>>>> size changes >>>>>>>', entries);
    });
    setDimensions(resizeObserver);
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div onMouseDown={props.handleClick} onTouchStart={props.handleClick}>
      <canvas ref={ref} id='whiteboardCanvas' />
    </div>
  );
}

export default memo(WhiteboardCanvas);
