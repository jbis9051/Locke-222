import User from '../../models/User';
import React, { useRef, useState } from 'react';
import './UserItem.css';
import ReactTooltip from 'react-tooltip';
import PopOutMenu from '../PopOutMenu';

export default function UserItem({
    user,
    popupDirection,
}: {
    user: User;
    popupDirection: 'left' | 'right';
}) {
    let tooltipRef = useRef(null);
    const [visible, setVisible] = useState(false);

    function tooltipOpen() {
        if (tooltipRef) {
            setVisible(true);
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className={'user-item-wrapper'}>
            <div ref={tooltipRef} onClick={tooltipOpen} className={'user-item'}>
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
            <PopOutMenu
                shouldClose={() => setVisible(false)}
                direction={popupDirection}
                element={() => tooltipRef.current!}
                visible={visible}
            >
                <div className={'user-popout-menu'}>
                    <h1>Test</h1>
                </div>
            </PopOutMenu>
        </div>
    );
}
