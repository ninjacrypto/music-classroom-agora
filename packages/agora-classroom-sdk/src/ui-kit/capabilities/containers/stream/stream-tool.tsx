import { useStore } from '@/infra/hooks/ui-store';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import { EduStreamTool, EduStreamToolCategory } from '@/infra/stores/common/stream/tool';
import { FcrUIConfig } from '@/infra/types/config';
import { EduRoleTypeEnum, EduClassroomConfig } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Popover, SvgIcon, SvgImg, Tooltip } from '~ui-kit';
import { visibilityListItemControl } from '../visibility';
import { useState } from 'react';
import {
  studentBoardAuthEnabled,
  studentCameraToolEnabled,
  studentMicrophoneToolEnabled,
  studentOffStageEnabled,
  studentRewardEnabled,
  studentStreamToolsPanelEnabled,
  teacherOffStageEnabled,
  teacherResetPosEnabled,
  teacherStreamToolsPanelEnabled,
} from '../visibility/controlled';
import { useMusicFunRtmContext } from '@/mf-rtm';
import { EmotesvgDict1, InstrumentSvgDict } from '../pretest';
import { useSelector } from 'react-redux';

export const StreamPlayerToolbar: FC<{
  visible: boolean;
  stream: EduStreamUI;
  offset?: number[];
  placement?: 'left' | 'bottom';
}> = visibilityListItemControl(
  ({ stream, offset, placement, visible }) => {
    const { streamUIStore } = useStore();
    const { toolbarPlacement, toolbarOffset } = streamUIStore;

    return (
      <Popover
        visible={visible}
        align={{
          offset: offset ?? toolbarOffset,
        }}
        overlayClassName="video-player-tools-popover"
        content={
          stream.stream.isLocal ? (
            <LocalStreamPlayerTools />
          ) : (
            <RemoteStreamPlayerTools stream={stream} />
          )
        }
        placement={placement ?? toolbarPlacement}>
        <div className="stream-player-toolbar-placement w-full h-full absolute top-0 left-0" />
      </Popover>
    );
  },
  (uiConfig, { stream }) => {
    if (stream.role === EduRoleTypeEnum.teacher && !teacherStreamToolsPanelEnabled(uiConfig)) {
      return false;
    }
    if (stream.role === EduRoleTypeEnum.student && !studentStreamToolsPanelEnabled(uiConfig)) {
      return false;
    }
    return true;
  },
);

export const LocalStreamPlayerTools = observer(() => {
  const { streamUIStore } = useStore();
  const { localStreamTools } = streamUIStore;

  return localStreamTools.length ? (
    <div className={`video-player-tools`}>
      {localStreamTools.map((tool, idx) => (
        <ToolItem tool={tool} key={`${idx}`} />
      ))}
    </div>
  ) : (
    <div />
  );
});

export const RemoteStreamPlayerTools = observer(({ stream }: { stream: EduStreamUI }) => {
  const { streamUIStore } = useStore();
  const { remoteStreamTools } = streamUIStore;
  const toolList = remoteStreamTools(stream);

  return toolList.length ? (
    <div className={`video-player-tools`}>
      {toolList.map((tool, idx) => (
        <ToolItem tool={tool} key={`${idx}`} />
      ))}
      <AdminStickerCabinet stream={stream} />
    </div>
  ) : (
    <div />
  );
});

const ToolItem: FC<{
  tool: EduStreamTool;
}> = visibilityListItemControl(
  observer(({ tool }) => {
    const { streamUIStore } = useStore();
    const { toolbarPlacement } = streamUIStore;
    return (
      <Tooltip title={tool.toolTip} placement={toolbarPlacement}>
        <span>
          {tool.interactable ? (
            <SvgIcon
              size={22}
              onClick={tool.onClick}
              type={tool.iconType.icon}
              colors={{ iconPrimary: tool.iconType.color }}
              hoverType={tool.hoverIconType?.icon ?? tool.iconType.icon}
              hoverColors={{ iconPrimary: tool.hoverIconType?.color ?? tool.iconType.color }}
            />
          ) : (
            <SvgImg
              colors={{ iconPrimary: tool.iconType.color }}
              type={tool.iconType.icon}
              size={22}
            />
          )}
        </span>
      </Tooltip>
    );
  }),
  (uiConfig: FcrUIConfig, { tool }) => {
    if (!teacherOffStageEnabled(uiConfig) && tool.category === EduStreamToolCategory.podium_all) {
      return false;
    }
    if (
      !teacherResetPosEnabled(uiConfig) &&
      tool.category === EduStreamToolCategory.stream_window_off
    ) {
      return false;
    }
    if (!studentCameraToolEnabled(uiConfig) && tool.category === EduStreamToolCategory.camera) {
      return false;
    }
    if (
      !studentMicrophoneToolEnabled(uiConfig) &&
      tool.category === EduStreamToolCategory.microphone
    ) {
      return false;
    }
    if (!studentBoardAuthEnabled(uiConfig) && tool.category === EduStreamToolCategory.whiteboard) {
      return false;
    }
    if (!studentOffStageEnabled(uiConfig) && tool.category === EduStreamToolCategory.podium) {
      return false;
    }
    if (!studentRewardEnabled(uiConfig) && tool.category === EduStreamToolCategory.star) {
      return false;
    }

    return true;
  },
);

const AdminStickerCabinet = ({ stream }: { stream: EduStreamUI }) => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const {
    streamUIStore,
    shareUIStore: { addToast },
  } = useStore();
  const { toolbarPlacement } = streamUIStore;
  const { publishStickerToSocket } = useMusicFunRtmContext();

  const globalStore = useSelector((state: any) => state.StickerSlice);

  const roomIndex = globalStore.findIndex((item: any) =>
    item?.roomId ? item?.roomId === EduClassroomConfig.shared.sessionInfo.roomName : 0,
  );
  const userProfileFinder = (userId: any) =>
    globalStore[roomIndex]?.students?.find((item: any) => item.userId === userId) ??
    globalStore[roomIndex]?.teachers.find((item: any) => item.userId === userId);

  const currentUser = userProfileFinder(stream.fromUser.userName);

  const teacherAssignedInstruments = currentUser?.stickers?.teacherAssignedInstrument || [];
  const userAssignedInstruments = currentUser?.stickers?.instruments || [];

  const handleClick = (sticker: string) => {
    publishStickerToSocket(
      'updateStickers',
      {
        userId: stream?.fromUser?.userName,
        role: 'student',
        stickerType: 'teacherAssignedEmojis',
        teacherAssignedEmojis: currentUser?.stickers?.teacherAssignedEmojis ?? [],
        newSticker: sticker,
      },
      EduClassroomConfig.shared.sessionInfo.roomName,
    );
  };

  const handleClickOnInstrument = (sticker: string) => {
    if ([...new Set(teacherAssignedInstruments.concat(userAssignedInstruments))].length > 3) {
      addToast('Stickers limit reached!', 'error');
      return;
    }

    publishStickerToSocket(
      'updateStickers',
      {
        userId: stream?.fromUser?.userName,
        role: 'student',
        stickerType: 'teacherAssignedInstrument',
        teacherAssignedInstrument: currentUser?.stickers?.teacherAssignedInstrument ?? [],
        newSticker: sticker,
      },
      EduClassroomConfig.shared.sessionInfo.roomName,
    );
  };

  const adminStickers = {
    // adminHeart,
    // adminStar,
    ...EmotesvgDict1,
  };

  const content = () => (
    <div className={`expand-tools colors`}>
      {Object.keys(adminStickers)?.map((sticker: any) => (
        <div key={sticker} onClick={() => handleClick(sticker)} className="expand-tool color">
          <img src={adminStickers[sticker]} alt="" />
        </div>
      ))}
      {Object.keys(InstrumentSvgDict)?.map((sticker: any) => (
        <div
          key={sticker}
          onClick={() => handleClickOnInstrument(sticker)}
          className="expand-tool color">
          <img src={InstrumentSvgDict[sticker]} alt="" />
        </div>
      ))}
    </div>
  );

  return (
    <Tooltip title={'stickers'} placement={toolbarPlacement} overlayClassName="translated-tooltip">
      <Popover
        visible={popoverVisible}
        onVisibleChange={(visible) => setPopoverVisible(visible)}
        overlayClassName="expand-tools-popover"
        trigger="hover"
        content={content}
        placement="top">
        <img src="/smileEmoji.svg" alt="" />
      </Popover>
    </Tooltip>
  );
};
