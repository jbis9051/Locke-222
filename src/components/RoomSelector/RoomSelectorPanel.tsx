import './RoomSelectorPanel.css';
import React, { useEffect, useRef, useState } from 'react';
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
    const [currentAnimationFinished, setCurrentAnimationFinished] = useState(true);

    const loader = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loader.current) {
            return;
        }
        function finishAnimation() {
            setCurrentAnimationFinished(true);
        }
        if (refreshLoaded) {
            loader.current!.addEventListener('animationiteration', finishAnimation);
        } else {
            loader.current!.removeEventListener('animationiteration', finishAnimation);
        }
    }, [refreshLoaded, loader]);

    return useObserver(() => (
        <div className={'room-selector'}>
            {/*     <RoomItem longname={'All Rooms'} shortname={'All'} />
            {CurrentUserStore.recentRooms.length > 0 && <div className={'room-divider'} />}*/}
            {CurrentUserStore.recentRooms.map((room) => (
                <RoomItem
                    key={room.id}
                    onClick={() => IO.changeRoom(room.id)}
                    selected={
                        room.id === RoomStore.id &&
                        !CurrentUserStore.favoriteRooms.some((roomObj) => roomObj.id === room.id)
                    }
                    longname={room.name}
                    shortname={abbreviateString(room.name)}
                />
            ))}
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
                    setCurrentAnimationFinished(false);
                    setRefreshLoaded(false);
                    IO.refreshFavoriteRooms().then(() => {
                        setRefreshLoaded(true);
                    });
                }}
                selected={false}
                longname={'Refresh Favorite Rooms'}
                shortname={
                    <div
                        ref={loader}
                        className={`room-selector-refresh ${
                            !currentAnimationFinished ? 'loading' : null
                        }`}
                    >
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </div>
                }
            />
        </div>
    ));
}
