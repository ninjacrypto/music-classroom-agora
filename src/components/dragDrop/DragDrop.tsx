import React, { useState, useRef, useEffect } from 'react';
import './dragDrop.css';
import { useDispatch, useSelector } from 'react-redux';
import { replaceMeetingImage } from '../../slices/userVideoSlice';
import { get } from 'lodash';
import Loader from 'react-loader-spinner';
import { fileValidator, preventBrowserDefaults } from '../../utils/drap-drop';
import { RootState } from '../../store/store';
import socket from '../../hooks/Meeting.socket';
import { useAlert } from 'react-alert';

const config = {
  allowedFileFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  fileSizeMBLimit: 20,
  filesLimit: 1,
};

export default function App(props: any) {
  const dispatch = useDispatch();
  let [dragOverlay, setDragOverlay] = useState(false);
  const { image, channel } = useSelector((state: RootState) => state.meeting);
  const [loading, setLoading] = useState(false);
  const dragCounter = useRef(0);
  const ref = useRef<any>();
  const alert = useAlert();
  const handleDrag = (e: any) => {
    preventBrowserDefaults(e);
  };

  const handleDragIn = (e: any) => {
    preventBrowserDefaults(e);
    dragCounter.current++;
    if (get(e, 'dataTransfer.items.length') > 0) {
      setDragOverlay(true);
    }
  };

  const handleDragOut = (e: any) => {
    preventBrowserDefaults(e);
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverlay(false);
    }
  };
  const handleOnRemoveImage = () => {
    resetInput();
    dispatch(replaceMeetingImage(null));
    socket.shareImageToPeer.publish(channel, null);
  };
  const handleDrop = (e: any) => {
    const files = get(e, 'dataTransfer.files');
    preventBrowserDefaults(e);
    setDragOverlay(false);
    dragCounter.current = 0;
    const { isValidFile, errVal } = fileValidator(files, config);
    if (!isValidFile) {
      if (errVal) {
        alert.show(errVal, { type: 'error' });
      }
      return false;
    }
    if (files) {
      fileReader(files);
    }
    resetInput();
  };

  const resetInput = () => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const fileReader = (files: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (loadEvt: any) => {
      dispatch(replaceMeetingImage(loadEvt.target.result));
      socket.shareImageToPeer.publish(channel, loadEvt.target.result);
    };
    // reader.abort();
    return false;
  };

  const handleChange = (e: any) => {
    // resetInput();

    const files = e.target.files;
    if (e.target.files.length) {
      // handleUpload(e.target.files[0]);
      fileReader(files);
      resetInput();
    }
  };

  // const handleUpload = async (image: any) => {
  //   // const Data = new FormData();
  //   // Data.append('image', image);
  //   try {
  //     setLoading(true);
  //     dispatch(replaceMeetingImage(URL.createObjectURL(image)));
  //     socket.shareImageToPeer.publish(channel, URL.createObjectURL(image));

  //     setLoading(false);
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err.response.data);
  //   }
  // };

  const dragOverlayClass = dragOverlay ? 'overlay' : '';

  return (
    <div style={{ height: '100%', width: '100%', textAlign: 'center', position: 'relative' }}>
      <label htmlFor='upload-button'>
        {loading ? (
          <div style={{ marginTop: 20, marginBottom: 10, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader type='Grid' color='#ffffff' height={30} width={30} />
          </div>
        ) : image ? (
          <>
            <img src={image} alt='dummy' style={{ height: '100%', width: '100%', overflow: 'auto', objectFit: 'contain' }} />
          </>
        ) : (
          <>
            <div
              className={`tabPanel_upload_file ${dragOverlayClass}`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              <img src='/assets/imageUpload.png' alt='' height={100} width={100} />
              <text>Upload Image</text>
            </div>
          </>
        )}
      </label>
      {image && (
        <img
          src={'/assets/removeImg.png'}
          alt=''
          style={{ position: 'absolute', right: '10px', top: '10px', height: '30px' }}
          onClick={handleOnRemoveImage}
        />
      )}

      <input type='file' id='upload-button' style={{ display: 'none' }} ref={ref} onChange={handleChange} />
      <br />
    </div>
  );
}
