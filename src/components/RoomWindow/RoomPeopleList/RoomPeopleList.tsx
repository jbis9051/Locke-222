import React from 'react';
import './RoomPeopleList.css';
import RoomStore from '../../../stores/RoomStore';
import UserItem from '../UserItem';
import { useObserver } from 'mobx-react';
import User from '../../../models/User';

export default function RoomPeopleList() {
    return useObserver(() => (
        <div className={'room-people-list'}>
            <div className={'room-people-list-title'}>Moderators</div>
            {RoomStore.users
                .filter((user) => user.is_moderator)
                .map((user) => (
                    <UserItem popupDirection={'left'} key={user.id} user={user} />
                ))}
            <div className={'room-people-list-title'}>Room Owners</div>
            {RoomStore.users
                .filter((user) => user.is_owner && !user.is_moderator)
                .map((user) => (
                    <UserItem popupDirection={'left'} key={user.id} user={user} />
                ))}
            <div className={'room-people-list-title'}>Members</div>
            {RoomStore.users
                .filter((user) => !user.is_owner && !user.is_moderator)
                .map((user) => (
                    <UserItem popupDirection={'left'} key={user.id} user={user} />
                ))}
        </div>
    ));
}
