import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import './RoomTopBar.css';
import RoomStore from '../../../stores/RoomStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import RoomDropDown from './RoomDropDown';
import { parseMarkdown } from '../../../helpers/markdownHelper';

export default function RoomTopBar() {
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);

    return useObserver(() => (
        <div className={'room-top-bar'}>
            <div className={'room-top-bar--name-wrapper'}>
                <span className={'room-top-bar--name-wrapper__name'}>{RoomStore.name}</span>
                <span
                    className={'room-top-bar--name-wrapper__arrow'}
                    onClick={() => setRoomMenuOpen((prevState) => !prevState)}
                >
                    <FontAwesomeIcon icon={faChevronDown} />
                </span>
                {roomMenuOpen ? <RoomDropDown /> : null}
            </div>
            <div className={'room-top-bar--description-wrapper'}>
                {parseMarkdown(RoomStore.description)}
            </div>
        </div>
    ));
}
