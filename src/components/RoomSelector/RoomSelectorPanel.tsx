import './RoomSelectorPanel.css';
import React from 'react';
import RoomItem from './RoomItem';
import CurrentUserStore from '../../stores/CurrentUserStore';
import abbreviateString from '../../helpers/abbreviateString';
import { useObserver } from 'mobx-react';

export default function RoomSelectorPanel() {
    return useObserver(() => (
        <div className={"room-selector"}>
            <RoomItem longname={"All Rooms"} shortname={"All"}/>
            <div className={"room-divider"}/>
            {
                CurrentUserStore.favoriteRooms.map(room =>
                    <RoomItem key={room.id} longname={room.name} shortname={abbreviateString(room.name)}/>
                )
            }
        </div>
    ));
}
