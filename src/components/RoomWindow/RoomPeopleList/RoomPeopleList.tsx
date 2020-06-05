import React from 'react';
import './RoomPeopleList.css';
import RoomStore from '../../../stores/RoomStore';
import UserItem from '../UserItem';

export default function RoomPeopleList() {
    return (
        <div className={"room-people-list"}>
            {
                RoomStore.users.map(user => (
                   <UserItem user={user}/>
                ))
            }
        </div>
    );
}
