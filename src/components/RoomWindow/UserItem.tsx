import React, { useRef, useState } from 'react';
import User from '../../models/User';
import './UserItem.css';
import PopOutMenu from '../PopOutMenu';
import IO from '../../controllers/IO';
import { ThumbsResponse } from '../../interfaces/APIResponses';

export default function UserItem({
    user,
    displayName = true,
    displayAvatar = true,
    popupDirection,
}: {
    user: User;
    displayName?: boolean;
    displayAvatar?: boolean;
    popupDirection: 'left' | 'right' | false;
}): React.ReactElement {
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState<ThumbsResponse | null>(null);
    const userButton = useRef<HTMLDivElement>(null);

    const shouldClose = useRef(() => {
        setUserData(null);
        setVisible(false);
    });

    function tooltipOpen() {
        if (!popupDirection) {
            return;
        }
        IO.getUserThumb(user.id)
            .then((thumb) => {
                setUserData(thumb);
                setVisible(true);
            })
            .catch(console.error);
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
        <div ref={userButton} onClick={tooltipOpen} className="user-item-wrapper">
            <div className="user-item">
                {displayAvatar && (
                    <img
                        className="user-item__image"
                        width="30px"
                        height="30px"
                        style={displayName ? { marginRight: '10px' } : undefined}
                        src={`${user.image_url}?s=42`}
                    />
                )}
                {displayName && (
                    <span className="user-item--name">
                        <span>{user.name}</span>
                    </span>
                )}
            </div>
            <PopOutMenu
                shouldClose={shouldClose.current}
                direction={popupDirection || 'left'}
                elRect={userButton.current?.getBoundingClientRect()}
                visible={visible}
            >
                <div
                    onClick={(e) => popupDirection && e.stopPropagation()}
                    className="user-popout-menu"
                >
                    <div className="user-popout-menu--user-info">
                        <img
                            src={user.image_url}
                            className="user-popout-menu--user-info__profile-image"
                        />
                        <span className="user-popout-menu--user-info__name">{user.name}</span>
                        <div className="user-popout-menu--user-info--links">
                            <a target="_blank" rel="noreferrer" href={`/users/${user.id}`}>
                                Chat Profile
                            </a>
                            <a target="_blank" rel="noreferrer" href={userData?.profileUrl}>
                                Site Profile
                            </a>
                        </div>
                    </div>
                    <div className="user-popout-menu--user-bio">
                        <div className="user-popout-menu--user-bio--topic">Role</div>
                        <span>{roles.join(', ')}</span>
                        {userData ? (
                            <>
                                <div className="user-popout-menu--user-bio--topic">Reputation</div>
                                <span>{userData.reputation}</span>
                                <div className="user-popout-menu--user-bio--topic">Bio</div>
                                <span>{userData.user_message}</span>
                            </>
                        ) : null}
                    </div>
                </div>
            </PopOutMenu>
        </div>
    );
}
