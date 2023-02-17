import { observer } from 'mobx-react';
import { useInteractiveUIStores } from '@/infra/hooks/ui-store';
import React, { useCallback, useState, useMemo } from 'react';
import { EduInteractiveUIClassStore } from '@/infra/stores/interactive';
import { carouselGroup, NavGroup } from '.';
import { visibilityControl } from '../visibility';
import { studentVideoEnabled, teacherVideoEnabled } from '../visibility/controlled';
import { DragableStream } from './draggable-stream';
import { useSelector } from 'react-redux';

export const RoomMidStreamsContainer = observer(() => {
  const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

  const { stageVisible } = streamUIStore;

  return (
    <div
      id="stage-container"
      className={`w-full flex-grow flex-shrink-0 ${stageVisible ? '' : 'hidden'}`}>
      <div className="h-full flex justify-center items-center relative">
        <TeacherStream />
        <StudentStreams />
      </div>
    </div>
  );
});

export const TeacherStream = visibilityControl(
  observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;
    const { teacherCameraStream, videoStreamSize, gap } = streamUIStore;

    const style = {
      marginRight: gap - 2,
    };

    const playerStyle = {
      width: videoStreamSize.width,
      height: videoStreamSize.height,
    };

    return <DragableStream style={style} playerStyle={playerStyle} stream={teacherCameraStream} />;
  }),
  teacherVideoEnabled,
);

export const StudentStreams = visibilityControl(
  observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

    const { videoStreamSize, carouselNext, carouselPrev, scrollable, gap, carouselStreams } =
      streamUIStore;

    const [navigationVisible, setNavigationVisible] = useState(false);

    const mouseHandler = useCallback(
      (visible: boolean) => () => {
        setNavigationVisible(visible);
      },
      [],
    );

    let streams = carouselGroup(
      videoStreamSize.width,
      videoStreamSize.height,
      carouselStreams,
      gap,
    );

    return (
      <div onMouseEnter={mouseHandler(true)} onMouseLeave={mouseHandler(false)}>
        {/* {scrollable && (
          <NavGroup visible={navigationVisible} onPrev={carouselPrev} onNext={carouselNext} />
        )} */}
        {streams}
        {/* <CarouselGroup
          gap={gap}
          videoWidth={videoStreamSize.width}
          videoHeight={videoStreamSize.height}
          carouselStreams={carouselStreams}
        /> */}
      </div>
    );
  }),
  studentVideoEnabled,
);

export const LeftSideStudents = visibilityControl(
  observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

    const { videoStreamSize, carouselNext, carouselPrev, scrollable, gap, carouselStreams } =
      streamUIStore;

    const [navigationVisible, setNavigationVisible] = useState(false);

    const mouseHandler = useCallback(
      (visible: boolean) => () => {
        setNavigationVisible(visible);
      },
      [],
    );

    // const { teachers, students } = useSelector((state: any) => state.StickerSlice);

    // const userProfileFinder = (userId: any) =>
    //   students?.find((item: any) => item.userId === userId) ??
    //   teachers.find((item: any) => item.userId === userId);

    let streams = carouselGroup(
      videoStreamSize.width,
      videoStreamSize.height,
      carouselStreams,
      gap,
    );

    const values = useMemo(() => {
      return carouselStreams.length + 1 || 1;
    }, [carouselStreams.length]);

    let elements = [
      <div className={`vidCapture${values}_${1}`}>
        <TeacherStream />
      </div>,
    ];
    for (let i = 1; i < values; i++) {
      if (i === 3) {
        elements.push(<div className={`vidCapture${values}_${2}`}>{streams[i - 1]}</div>);
      }
    }

    return (
      <React.Fragment>
        <div className={`newMainContentLeft${values > 1 ? `X${values}` : ''}`}>{elements}</div>
      </React.Fragment>
    );
  }),
  studentVideoEnabled,
);

export const RightSideStudents = visibilityControl(
  observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

    const { videoStreamSize, carouselNext, carouselPrev, scrollable, gap, carouselStreams } =
      streamUIStore;

    const [navigationVisible, setNavigationVisible] = useState(false);

    const mouseHandler = useCallback(
      (visible: boolean) => () => {
        setNavigationVisible(visible);
      },
      [],
    );

    let streams = carouselGroup(
      videoStreamSize.width,
      videoStreamSize.height,
      carouselStreams,
      gap,
    );

    const values = useMemo(() => {
      return streams.length + 1 || 1;
    }, [streams.length]);
    let elements = [];

    if (values <= 1) return <></>;
    for (let i = 1; i < values; i++) {
      let condition1 = values >= 4 && i == 3;
      let condition2 = values > 10 && i >= 10;

      if (condition1 || condition2) {
      } else {
        elements.push(<div className={`vidCapture${values}_${i + 1}`}>{streams[i - 1]}</div>);
      }
    }

    return (
      <React.Fragment>
        <div className={`newMainContentRightX${values}`}>{elements}</div>
      </React.Fragment>
    );
  }),
  studentVideoEnabled,
);

export const BottomStudents = visibilityControl(
  observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

    const { videoStreamSize, gap, carouselStreams } = streamUIStore;

    const [navigationVisible, setNavigationVisible] = useState(false);

    const mouseHandler = useCallback(
      (visible: boolean) => () => {
        setNavigationVisible(visible);
      },
      [],
    );

    let streams = carouselGroup(
      videoStreamSize.width,
      videoStreamSize.height,
      carouselStreams,
      gap,
    );

    const values = useMemo(() => {
      return streams.length + 1 || 1;
    }, [streams.length]);

    let elements: any[] = [];
    if (values >= 11) {
      for (let i = 11; i <= values; i++) {
        elements.push(<div className={`vidCapture${values}_${i}`}>{carouselStreams[i - 3]}</div>);
      }

      return (
        <React.Fragment>
          <div className="newMainContentBottom">{elements}</div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="newMainContentBottom">{elements}</div>
      </React.Fragment>
    );
  }),
  studentVideoEnabled,
);
