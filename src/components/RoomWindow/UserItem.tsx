import User from '../../models/User';
import React, { useEffect, useRef, useState } from 'react';
import './UserItem.css';
import PopOutMenu from '../PopOutMenu';
import IO from '../../controllers/IO';
import { ThumbsResponse } from '../../interfaces/APIResponses';

export default function UserItem({
    user,
    popupDirection,
}: {
    user: User;
    popupDirection: 'left' | 'right';
}) {
    let tooltipRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState<ThumbsResponse | null>(null);

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

    useEffect(() => {
        if (visible) {
            IO.getUserThumb(user.id).then((thumb) => {
                setUserData(thumb);
            });
        }
    }, [visible]);

    function shouldClose() {
        setUserData(null);
        setVisible(false);
    }

    // @ts-ignore
    return (
        <div className={'user-item-wrapper'}>
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
                shouldClose={shouldClose}
                direction={popupDirection}
                element={() => tooltipRef.current!}
                visible={visible}
            >
                <div onClick={(e) => e.stopPropagation()} className={'user-popout-menu'}>
                    <div className={'user-popout-menu--user-info'}>
                        <img
                            src={user.image_url!}
                            className={'user-popout-menu--user-info__profile-image'}
                        />
                        <span className={'user-popout-menu--user-info__name'}>{user.name}</span>
                    </div>
                    <div className={'user-popout-menu--user-bio'}>
                        <div className={'user-popout-menu--user-bio--topic'}>Role</div>
                        <span>{roles.join(', ')}</span>
                        {userData ? (
                            <React.Fragment>
                                <div className={'user-popout-menu--user-bio--topic'}>
                                    Reputation
                                </div>
                                <span>{userData.reputation}</span>
                                <div className={'user-popout-menu--user-bio--topic'}>Bio</div>
                                <span>{userData.user_message}</span>
                            </React.Fragment>
                        ) : null}
                    </div>
                </div>
            </PopOutMenu>
        </div>
    );
}
