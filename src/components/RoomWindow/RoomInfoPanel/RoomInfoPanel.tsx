import './RoomInfoPanel.css';
import React from 'react';
import StarsList from './Stars/StarsList';
import UserItem from '../UserItem';
import CurrentUserStore from '../../../stores/CurrentUserStore';
import { MainWindowState } from '../../../interfaces/UIStates';
import UIStore from '../../../stores/UIStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

function RoomChannel({ name, id }: { name: string; id: MainWindowState }) {
    return (
        <div
            onClick={() => (UIStore.mainWindow = id)}
            className={'room-channel ' + (UIStore.mainWindow === id ? 'selected' : '')}
        >
            <span className={'room-channel__icon'}>
                <FontAwesomeIcon icon={faHashtag} />
            </span>
            <span className={'room-channel__name'}>{name}</span>
        </div>
    );
}

export default function RoomInfoPanel() {
    return (
        <div className={'room-info'}>
            <StarsList />
            <div className={'room-channels'}>
                <RoomChannel name={'Chat'} id={MainWindowState.MAIN_CHAT} />
                <RoomChannel name={'All Stars'} id={MainWindowState.ALL_STARS} />
                <RoomChannel name={'Stared By Me'} id={MainWindowState.STARED_BY_ME} />
                <RoomChannel name={'Posted By Me'} id={MainWindowState.POSTED_BY_ME} />
            </div>
            <div className={'room-info--me'}>
                <UserItem popupDirection={'right'} user={CurrentUserStore.user!} />
            </div>
        </div>
    );
}
