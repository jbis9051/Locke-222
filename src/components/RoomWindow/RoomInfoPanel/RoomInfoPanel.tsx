import './RoomInfoPanel.css';
import React from 'react';
import StarsList from './Stars/StarsList';
import UserItem from '../UserItem';
import CurrentUserStore from '../../../stores/CurrentUserStore';

export default function RoomInfoPanel() {
    return (
        <div className={'room-info'}>
            <StarsList />
            <div className={'room-info--me'}>
                <UserItem popupDirection={'right'} user={CurrentUserStore.user!} />
            </div>
        </div>
    );
}
