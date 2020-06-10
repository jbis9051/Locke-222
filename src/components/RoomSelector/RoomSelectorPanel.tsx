import './RoomSelectorPanel.css';
import React, { useState } from 'react';
import RoomItem from './RoomItem';
import CurrentUserStore from '../../stores/CurrentUserStore';
import abbreviateString from '../../helpers/abbreviateString';
import { useObserver } from 'mobx-react';
import RoomStore from '../../stores/RoomStore';
import IO from '../../controllers/IO';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RoomSelectorPanel() {
    const [refreshLoaded, setRefreshLoaded] = useState(true);

    return useObserver(() => (
        <div className={'room-selector'}>
            <RoomItem longname={'All Rooms'} shortname={'All'} />
            <div className={'room-divider'} />
            {CurrentUserStore.favoriteRooms.map((room) => (
                <RoomItem
                    key={room.id}
                    onClick={() => IO.changeRoom(room.id)}
                    selected={room.id === RoomStore.id}
                    longname={room.name}
                    shortname={abbreviateString(room.name)}
                />
            ))}
            <div className={'room-divider'} />
            <RoomItem
                onClick={() => {
                    setRefreshLoaded(false);
                    IO.refreshFavoriteRooms().then(() => {
                        setTimeout(() => {
                            setRefreshLoaded(true);
                        }, 1000); // sshh, don't tell anyone. It looks better this way.
                    });
                }}
                selected={false}
                longname={'Refresh Favorite Rooms'}
                shortname={
                    <div className={`room-selector-refresh ${!refreshLoaded ? 'loading' : null}`}>
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </div>
                }
            />
        </div>
    ));
}
