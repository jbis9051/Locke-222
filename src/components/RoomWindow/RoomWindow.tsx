import React from 'react';
import './RoomWindow.css';
import { useObserver } from 'mobx-react';
import RoomTopBar from './RoomTopBar/RoomTopBar';
import RoomInfoPanel from './RoomInfoPanel/RoomInfoPanel';
import RoomPeopleList from './RoomPeopleList/RoomPeopleList';
import ChatWindow from './Chat/ChatWindow';
import { MainWindowState } from '../../interfaces/UIStates';
import UIStore from '../../stores/UIStore';
import StarsChannel from './StarsChannel/StarsChannel';
import { StarFilter } from '../../interfaces/StarFilter';

export default function RoomWindow(): React.ReactElement {
    const windows: Record<MainWindowState, React.ReactElement> = {
        [MainWindowState.MAIN_CHAT]: <ChatWindow />,
        [MainWindowState.ALL_STARS]: <StarsChannel filter={StarFilter.ALL} />,
        [MainWindowState.STARED_BY_ME]: <StarsChannel filter={StarFilter.STARED_BY_ME} />,
        [MainWindowState.POSTED_BY_ME]: <StarsChannel filter={StarFilter.POSTED_BY_ME} />,
    };

    return useObserver(() => (
        <div className="room-window">
            <RoomTopBar />
            <div className="room-content-wrapper">
                <RoomInfoPanel />
                <div className="main-window">{windows[UIStore.mainWindow]}</div>
                <RoomPeopleList />
            </div>
        </div>
    ));
}
