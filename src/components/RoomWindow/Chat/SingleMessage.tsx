import React, { useState } from 'react';
import { useObserver } from 'mobx-react';
import Message from '../../../models/Message';
import format from '../../../helpers/dateFormatter';
import './SingleMessage.css';

interface IMessageProps {
    message: Message;
}

const SingleMessage: React.FunctionComponent<IMessageProps> = ({ message }) => {
    const [hover, setHover] = useState(false);

    return useObserver(() => (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="single-message__container"
        >
            <div className="single-message__content">{message.content}</div>
            {hover && (
                <div className="single-message__timestamp">{format(message.dateCreated)}</div>
            )}
        </div>
    ));
};

export default SingleMessage;
