import React, { ChangeEvent, Component, useEffect } from 'react';
import { forEach } from 'lodash';
import { IEvent } from 'fabric/fabric-impl';
import WhiteboardDrawingService from '../../hooks/Whiteboard/WhiteboardDrawingService';
import WhiteboardBrushService from '../../hooks/Whiteboard/WhiteboardBrushService';
import { useSelector, useDispatch } from 'react-redux';
import { replaceActiveMenu, replaceColor, replaceSize, WhiteboardActiveMenu } from '../../slices/whiteboardSlice';
import { MeetingWhiteboardDrawingsState } from '../../slices/userVideoSlice';
import { WhiteboardBrushColorObject } from '../WhiteboardBrushColor/WhiteboardBrushColor';
import WhiteboardCanvas from '../WhiteboardCanvas/WhiteboardCanvas';
import WhiteboardMenu from '../WhiteboardMenu/WhiteboardMenu';
import styles from './Whiteboard.module.scss';
import { RootState } from '../../store/store';

export type WhiteboardDrawingAddHandle = (event: IEvent) => void;

interface WhiteboardProps {
  drawings: MeetingWhiteboardDrawingsState;
  handleCanvasClearClick: () => void;
  handleDrawingAdd: WhiteboardDrawingAddHandle;
}

// class Whiteboard extends Component<WhiteboardProps> {
//   whiteboardDrawingService: WhiteboardDrawingService;
//   whiteboardBrushService: WhiteboardBrushService;

//   constructor(props: WhiteboardProps) {
//     super(props);
//     this.whiteboardDrawingService = new WhiteboardDrawingService();
//     this.whiteboardBrushService = new WhiteboardBrushService();
//     this.handleCanvasClick = this.handleCanvasClick.bind(this);
//     this.handleActiveMenuClick = this.handleActiveMenuClick.bind(this);
//     this.handleBrushColorChange = this.handleBrushColorChange.bind(this);
//     this.handleBrushSizeChange = this.handleBrushSizeChange.bind(this);
//   }

//   handleCanvasClick() {
//     this.props.replaceActiveMenu(null);
//   }

//   handleActiveMenuClick(activeMenu: WhiteboardActiveMenu) {
//     this.props.replaceActiveMenu(activeMenu);
//   }

//   handleAddDrawing() {
//     this.whiteboardDrawingService.handleAdd((event) => {
//       this.props.handleDrawingAdd(event);
//     });
//   }

//   handleBrushColorChange(color: WhiteboardBrushColorObject) {
//     this.whiteboardBrushService.setColor(color.hex);
//     this.props.replaceColor(color.hex);
//   }

//   handleBrushSizeChange(event: ChangeEvent) {
//     const input = event.target as HTMLInputElement;
//     const size = input.value;
//     this.whiteboardBrushService.setSize(size);
//     this.props.replaceSize(size);
//   }

//   syncDrawing() {
//     const drawings = this.props.drawings;
//     forEach(drawings, (drawing) => {
//       const isFromSocket: boolean = !drawing._set;
//       if (isFromSocket) {
//         this.whiteboardDrawingService.parse(drawing, (drawings) => {
//           this.whiteboardDrawingService.add(drawings);
//         });
//       } else {
//         this.whiteboardDrawingService.add([drawing]);
//       }
//     });
//   }

//   setPresets() {
//     this.whiteboardBrushService.setSize(this.props.brushSize);
//     this.whiteboardBrushService.setColor(this.props.brushColor);
//   }

//   componentDidMount() {
//     this.handleAddDrawing();
//     this.syncDrawing();
//     this.setPresets();
//   }

//   render() {
//     return (
//       <div className={styles.whiteboard}>
//         <WhiteboardCanvas handleClick={this.handleCanvasClick} />
//         <WhiteboardMenu
//           activeMenu={this.props.activeMenu}
//           brushColor={this.props.brushColor}
//           brushSize={this.props.brushSize}
//           handleBrushColorChange={this.handleBrushColorChange}
//           handleBrushSizeChange={this.handleBrushSizeChange}
//           handleCanvasClearClick={this.props.handleCanvasClearClick}
//           handleActiveMenuClick={this.handleActiveMenuClick}
//         />
//       </div>
//     );
//   }
// }

// export default Whiteboard;

function Whiteboard(props: WhiteboardProps) {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const whiteboardBrushService = new WhiteboardBrushService();
  const whiteboardDrawingService = new WhiteboardDrawingService();

  useEffect(() => {
    syncDrawing();
    handleAddDrawing();
    setPresets();
  }, []);

  const handleCanvasClick = () => {
    dispatch(replaceActiveMenu(null));
  };

  const handleActiveMenuClick = (activeMenu: WhiteboardActiveMenu) => {
    dispatch(replaceActiveMenu(activeMenu));
  };

  const handleAddDrawing = () => {
    whiteboardDrawingService.handleAdd((event) => {
      props.handleDrawingAdd(event);
    });
  };

  const handleBrushColorChange = (color: WhiteboardBrushColorObject) => {
    whiteboardBrushService.setColor(color.hex);
    dispatch(replaceColor(color.hex));
  };

  const handleBrushSizeChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const size = input.value;
    whiteboardBrushService.setSize(size);
    dispatch(replaceSize(size));
  };

  const syncDrawing = () => {
    const drawings = props.drawings;
    forEach(drawings, (drawing) => {
      const isFromSocket: boolean = !drawing._set;
      if (isFromSocket) {
        whiteboardDrawingService.parse(drawing, (drawings) => {
          whiteboardDrawingService.add(drawings);
        });
      } else {
        whiteboardDrawingService.add([drawing]);
      }
    });
  };

  const setPresets = () => {
    whiteboardBrushService.setSize(state.whiteboard.brushSize);
    whiteboardBrushService.setColor(state.whiteboard.brushColor);
  };

  return (
    <div className={styles.whiteboard}>
      <WhiteboardCanvas handleClick={handleCanvasClick} />
      <WhiteboardMenu
        activeMenu={state.whiteboard.activeMenu}
        brushColor={state.whiteboard.brushColor}
        brushSize={state.whiteboard.brushSize}
        handleBrushColorChange={handleBrushColorChange}
        handleBrushSizeChange={handleBrushSizeChange}
        handleCanvasClearClick={props.handleCanvasClearClick}
        handleActiveMenuClick={handleActiveMenuClick}
      />
    </div>
  );
}

export default Whiteboard;
