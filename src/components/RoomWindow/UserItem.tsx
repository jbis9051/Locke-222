import User from '../../models/User';
import React from 'react';
import './UserItem.css'

export default function UserItem({user}: {user: User}) {
    return (
        <div className={"user-item"}>
            <img className={"user-item__image"} width={"30px"} height={"30px"} src={user.image_url + "?s=42"}/>
            <span className={"user-item--name"}>{user.name}</span>
        </div>
    )
}
