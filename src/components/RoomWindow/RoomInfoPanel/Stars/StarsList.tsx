import React from 'react';
import RoomStore from '../../../../stores/RoomStore';
import MessageGroup from '../../Chat/MessageGroup';
import './StarList.css';
import { useObserver } from 'mobx-react';

export default function StarsList() {
    return useObserver(() => (
        <div className={'star-list'}>
            {RoomStore.stars.map((message) => (
                <MessageGroup key={message.id} messages={[message]} />
            ))}
        </div>
    ));
}
