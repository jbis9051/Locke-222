import React from 'react';
import RoomStore from '../../../stores/RoomStore';
import './ChatWindow.css';
import { useObserver } from 'mobx-react';
import MessageGroup from './MessageGroup';

export default function ChatWindow() {
    return useObserver(() => (
        <div className={'chat-window'}>
            {RoomStore.groupedMessages.map((group) => (
                <MessageGroup key={group[0].id} messages={group} />
            ))}
        </div>
    ));
}
