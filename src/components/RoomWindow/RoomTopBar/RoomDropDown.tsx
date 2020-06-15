import React from 'react';
import './RoomDropDown.css';

export default function RoomDropDown(): React.ReactElement {
    return (
        <div onClick={(e) => e.stopPropagation()} className="room-menu">
            <span>It's me, Mario!</span>
        </div>
    );
}
