import React from 'react';
import './RoomItem.css';
import ReactTooltip from "react-tooltip";

export default function RoomItem({longname, shortname, imagesrc, onClick}: {longname: string, shortname: string, imagesrc?: string, onClick?: () => void}) {
    const id = Math.random().toString();
    return (
        <div onClick={onClick} className={"room-selector--item"}>
            <ReactTooltip backgroundColor={"black"} effect={'solid'}  place={"right"} id={id}>
                <span>{longname}</span>
            </ReactTooltip>
            <span data-tip={""} className={"room-selector--item__bubble"} data-for={id}>{shortname}</span>
        </div>
    )
}
