import React from 'react';
import { useObserver } from 'mobx-react';
import RoomStore from '../../../stores/RoomStore';
import MessageGroup from './MessageGroup';
import './ChatWindow.css';

export default function ChatWindow(): React.ReactElement {
    return useObserver(() => (
        <div className="chat-window">
            {RoomStore.groupedMessages.map((group) => (
                <MessageGroup key={group[0].id} messages={group} />
            ))}
        </div>
    ));
}
