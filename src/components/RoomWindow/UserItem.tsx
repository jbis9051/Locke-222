import User from '../../models/User';
import React, { useRef, useState } from 'react';
import './UserItem.css';
import ReactTooltip from 'react-tooltip';
import PopOutMenu from '../PopOutMenu';

export default function UserItem({ user }: { user: User }) {
    let tooltipRef = useRef(null);
    const [visible, setVisible] = useState(false);

    function tooltipOpen() {
        if (tooltipRef) {
            setVisible(true);
            document.querySelector('body')!.addEventListener('click', tooltipClose);
        }
    }

    function tooltipClose() {
        if (tooltipRef) {
            setVisible(true);
            document.querySelector('body')!.removeEventListener('click', tooltipClose);
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className={'user-item-wrapper'}>
            <div
                ref={tooltipRef}
                data-tip={''}
                data-for={user.id.toString()}
                onClick={tooltipOpen}
                className={'user-item'}
            >
                <img
                    className={'user-item__image'}
                    width={'30px'}
                    height={'30px'}
                    src={user.image_url + '?s=42'}
                />
                <span className={'user-item--name'}>
                    <span>{user.name}</span>
                </span>
            </div>
            <PopOutMenu element={() => tooltipRef.current!} visible={visible}>
                <h1>{user.name}</h1>
            </PopOutMenu>
        </div>
    );
}
