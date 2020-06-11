import React from 'react';
import './RoomPeopleList.css';
import RoomStore from '../../../stores/RoomStore';
import UserItem from '../UserItem';
import { useObserver } from 'mobx-react';

export default function RoomPeopleList() {
    return useObserver(() => {
        const moderators: React.ReactElement[] = [];
        const ROs: React.ReactElement[] = [];
        const members: React.ReactElement[] = [];

        RoomStore.users.forEach((user) => {
            const component = (
                <div className={'room-people-list--item'}>
                    <UserItem popupDirection={'left'} key={user.id} user={user} />
                </div>
            );
            if (user.is_moderator) {
                moderators.push(component);
                return;
            }
            if (user.is_owner) {
                ROs.push(component);
                return;
            }
            members.push(component);
        });

        return (
            <div className={'room-people-list'}>
                <div className={'room-people-list-title'}>Moderators</div>
                {moderators}
                <div className={'room-people-list-title'}>Room Owners</div>
                {ROs}
                <div className={'room-people-list-title'}>Members</div>
                {members}
            </div>
        );
    });
}
