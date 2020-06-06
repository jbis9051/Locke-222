import User from '../../models/User';
import React, { useRef, useState } from 'react';
import './UserItem.css';
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

    const roles = [];
    if (user.is_moderator) {
        roles.push('Moderator');
    }
    if (user.is_owner) {
        roles.push('Owner');
    }
    if (!user.is_owner && !user.is_moderator) {
        roles.push('Member');
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
                    <div className={'user-popout-menu--user-info'}>
                        <img
                            src={user.image_url!}
                            className={'user-popout-menu--user-info__profile-image'}
                        />
                        <span className={'user-popout-menu--user-info__name'}>{user.name}</span>
                    </div>
                    <div className={'user-popout-menu--user-bio'}>
                        <div className={'user-popout-menu--user-bio--topic'}>Role</div>
                        {roles.map((role, index) => (
                            <span key={index}>{role}</span>
                        ))}
                    </div>
                </div>
            </PopOutMenu>
        </div>
    );
}
