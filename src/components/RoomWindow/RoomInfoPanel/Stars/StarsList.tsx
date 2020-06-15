import React from 'react';
import { useObserver } from 'mobx-react';
import RoomStore from '../../../../stores/RoomStore';
import MessageGroup from '../../Chat/MessageGroup';
import './StarList.css';

export default function StarsList(): React.ReactElement {
    return useObserver(() => (
        <div className="star-list">
            {RoomStore.stars.map((message) => (
                <MessageGroup key={message.id} messages={[message]} />
            ))}
        </div>
    ));
}
