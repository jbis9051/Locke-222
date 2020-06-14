import Message from '../../../models/Message';
import React from 'react';
import UserItem from '../UserItem';
import { useObserver } from 'mobx-react';
import './MessageGroup.css';
import SingleMessage from './SingleMessage';
import format from '../../../helpers/dateFormatter';

interface IMessageGroupProps {
    messages: Message[];
}

const MessageGroup: React.FunctionComponent<IMessageGroupProps> = ({ messages }) => {
    return useObserver(() => (
        <div className="message-group__container">
            <div className="message-group__avatar">
                <UserItem user={messages[0].user} popupDirection="right" displayName={false} />
            </div>
            <div className="message-group__text">
                <div className="message-group__header">
                    <UserItem
                        user={messages[0].user}
                        popupDirection="right"
                        displayAvatar={false}
                    />
                    <span className="message-group__timestamp">
                        {format(messages[0].dateCreated, 'relative')}
                    </span>
                </div>
                <div>
                    {messages.map((msg) => (
                        <SingleMessage key={msg.id} message={msg} />
                    ))}
                </div>
            </div>
        </div>
    ));
};

export default MessageGroup;
