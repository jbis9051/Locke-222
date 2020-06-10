import React from 'react';
import './RoomWindow.css';
import RoomTopBar from './RoomTopBar/RoomTopBar';
import RoomInfoPanel from './RoomInfoPanel/RoomInfoPanel';
import RoomPeopleList from './RoomPeopleList/RoomPeopleList';
import ChatWindow from './Chat/ChatWindow';
import { MainWindowState } from '../../interfaces/UIStates';
import UIStore from '../../stores/UIStore';
import { useObserver } from 'mobx-react';

export default function RoomWindow() {
    const windows: any = {
        [MainWindowState.MAIN_CHAT]: <ChatWindow />,
    };

    return useObserver(() => (
        <div className={'room-window'}>
            <RoomTopBar />
            <div className={'room-content-wrapper'}>
                <RoomInfoPanel />
                <div className={'main-window'}>{windows[UIStore.mainWindow]}</div>
                <RoomPeopleList />
            </div>
        </div>
    ));
}
