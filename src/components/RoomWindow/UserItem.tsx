import User from '../../models/User';
import React, { useRef } from 'react';
import './UserItem.css';
import ReactTooltip from 'react-tooltip';

export default function UserItem({ user }: { user: User }) {
    let tooltipRef: any;

    function tooltipOpen() {
        if(tooltipRef){
            ReactTooltip.show(tooltipRef);
            document.querySelector('body')!.addEventListener("click", tooltipClose)
        }
    }

    function tooltipClose() {
        if(tooltipRef){
            ReactTooltip.hide(tooltipRef);
            document.querySelector('body')!.removeEventListener("click", tooltipClose)
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className={'user-item-wrapper'}>
            <div  ref={ref => tooltipRef = ref} data-tip={""} data-for={user.id.toString()} onClick={tooltipOpen} className={'user-item'}>
                <img className={'user-item__image'} width={'30px'} height={'30px'} src={user.image_url + '?s=42'}/>
                <span className={'user-item--name'}><span>{user.name}</span></span>
            </div>
            <ReactTooltip id={user.id.toString()} place={"left"} effect={"solid"} event={"none"} className={"react-tooltip-clickable"}>
                <h1>{user.name}</h1>
            </ReactTooltip>
        </div>
    );
}
