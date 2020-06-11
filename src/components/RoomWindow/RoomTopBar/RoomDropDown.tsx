import React from 'react';
import './RoomDropDown.css';

export default function RoomDropDown() {
    return (
        <div onClick={(e) => e.stopPropagation()} className={'room-menu'}>
            <span>It's me, Mario!</span>
        </div>
    );
}
