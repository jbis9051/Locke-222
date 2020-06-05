import React from 'react';
import './RoomWindow.css';
import RoomTopBar from './RoomTopBar/RoomTopBar';
import RoomInfoPanel from './RoomInfoPanel/RoomInfoPanel';
import RoomPeopleList from './RoomPeopleList/RoomPeopleList';

export default function RoomWindow() {
    return (
        <div className={'room-window'}>
            <RoomTopBar />
            <div className={"room-content-wrapper"}>
                <RoomInfoPanel/>
                <RoomPeopleList/>
            </div>
        </div>
    );
}
