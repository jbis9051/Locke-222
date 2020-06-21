import React from 'react';
import { useObserver } from 'mobx-react';
import RoomStore from '../../../stores/RoomStore';
import MessageGroup from './MessageGroup';
import MessageInput from './MessageInput';
import './ChatWindow.css';

export default function ChatWindow(): React.ReactElement {
    return useObserver(() => (
        <div className="chat-window">
            <div className="message-list">
                {RoomStore.groupedMessages.map((group) => (
                    <MessageGroup key={group[0].id} messages={group} />
                ))}
            </div>
            <div className="message-input">
                <MessageInput showControls />
            </div>
        </div>
    ));
}
