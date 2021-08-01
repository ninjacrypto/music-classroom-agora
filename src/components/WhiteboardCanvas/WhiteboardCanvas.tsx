import { isPlatform } from '@ionic/react';
import React, { Component, useEffect, useCallback, useLayoutEffect } from 'react';
import WhiteboardCanvasService from '../../hooks/Whiteboard/WhiteboardCanvasService';

interface WhiteboardCanvasProps {
  handleClick: () => void;
}

export default class WhiteboardCanvas extends Component<WhiteboardCanvasProps> {
  whiteboardCanvasService: WhiteboardCanvasService;

  constructor(props: WhiteboardCanvasProps) {
    super(props);
    this.whiteboardCanvasService = new WhiteboardCanvasService();
  }

  setDimensions() {
    const width = document.getElementById('newMainContentRightInnerTextarea')?.clientWidth || 700;
    const mobileHeight = 500;
    const desktopHeight = document.getElementById('newMainContentRightInnerTextarea')?.clientHeight;
    const height = desktopHeight ? desktopHeight : mobileHeight;
    this.whiteboardCanvasService.setDimensions(width, height);
  }

  componentDidMount() {
    this.whiteboardCanvasService.initialize();
    setTimeout(() => {
      this.setDimensions();
    }, 1000);
  }

  render() {
    return (
      <div onMouseDown={this.props.handleClick} onTouchStart={this.props.handleClick}>
        <canvas id='whiteboardCanvas' />
      </div>
    );
  }
}
