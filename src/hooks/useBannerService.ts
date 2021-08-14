import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { BannerState, replaceBanner } from '../slices/bannerSlice';
import socket from '../hooks/Meeting.socket';

function useBannerService() {
  const { banner } = useSelector((state: RootState) => state.banner);
  const { channel } = useSelector((state: RootState) => state.meeting);
  const dispatch = useDispatch();

  const replaceBannerType = (type: BannerState) => {
    dispatch(replaceBanner(type));
    socket.changeBannerType.publish(channel, type);
  };

  const listenToBannerType = (meetingId: string) => {
    socket.changeBannerType.subscribe(meetingId, (type) => {
      dispatch(replaceBanner(type));
    });
  };

  useEffect(() => {
    listenToBannerType(channel);
    return () => {
      socket.changeBannerType.unsubscribe(channel);
    };
  }, []);

  return {
    replaceBannerType,
    banner,
  };
}

export default useBannerService;
