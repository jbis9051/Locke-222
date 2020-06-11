import { useObserver } from 'mobx-react';
import React, { useRef, useState } from 'react';
import './RoomTopBar.css';
import RoomStore from '../../../stores/RoomStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import RoomDropDown from './RoomDropDown';
import { parseMarkdown } from '../../../helpers/markdownHelper';
import UIStore from '../../../stores/UIStore';
import PopOutMenu from '../../PopOutMenu';

export default function RoomTopBar() {
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);
    const roomButton = useRef<HTMLDivElement>();

    const shouldClose = useRef(() => {
        setRoomMenuOpen(false);
    });

    return useObserver(() => (
        <div className={'room-top-bar'}>
            <div
                className={'room-top-bar--name-wrapper'}
                ref={roomButton as any}
                onClick={() => setRoomMenuOpen(true)}
            >
                <span className={'room-top-bar--name-wrapper__name'}>{RoomStore.name}</span>
                <span className={'room-top-bar--name-wrapper__arrow'}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <PopOutMenu
                    shouldClose={shouldClose.current}
                    visible={roomMenuOpen}
                    elRect={roomButton.current?.getBoundingClientRect()}
                    direction={'bottom'}
                >
                    <RoomDropDown />
                </PopOutMenu>
            </div>
            <div
                onClick={() => (UIStore.descriptionModal = true)}
                className={'room-top-bar--description-wrapper'}
            >
                {parseMarkdown(RoomStore.description)}
            </div>
        </div>
    ));
}
