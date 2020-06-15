import React from 'react';
import ReactTooltip from 'react-tooltip';
import './RoomItem.css';

export default function RoomItem({
    longname,
    shortname,
    imagesrc,
    onClick,
    selected,
}: {
    longname: string;
    shortname: string | React.ReactElement;
    selected?: boolean;
    imagesrc?: string;
    onClick?: () => void;
}): React.ReactElement {
    const id = Math.random().toString();
    return (
        <div onClick={onClick} className={`room-selector--item ${selected ? 'selected' : ''}`}>
            <ReactTooltip backgroundColor="black" effect="solid" place="right" id={id}>
                <span>{longname}</span>
            </ReactTooltip>
            <span data-tip="" className="room-selector--item__bubble" data-for={id}>
                {shortname}
            </span>
        </div>
    );
}
