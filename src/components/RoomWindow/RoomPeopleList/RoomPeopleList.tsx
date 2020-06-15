import React from 'react';
import './RoomPeopleList.css';
import { useObserver } from 'mobx-react';
import RoomStore from '../../../stores/RoomStore';
import UserItem from '../UserItem';

export default function RoomPeopleList(): React.ReactElement {
    return useObserver(() => {
        const moderators: React.ReactElement[] = [];
        const ROs: React.ReactElement[] = [];
        const members: React.ReactElement[] = [];

        RoomStore.users.forEach((user) => {
            const component = <UserItem popupDirection="left" user={user} key={user.id} />;
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
            <div className="room-people-list">
                {moderators.length > 0 && <div className="room-people-list-title">Moderators</div>}
                {moderators}
                {ROs.length > 0 && <div className="room-people-list-title">Room Owners</div>}
                {ROs}
                {members.length > 0 && <div className="room-people-list-title">Members</div>}
                {members}
            </div>
        );
    });
}
