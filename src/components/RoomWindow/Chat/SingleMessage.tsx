import React from 'react';
import { useObserver } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import Message from '../../../models/Message';
import format from '../../../helpers/dateFormatter';
import CurrentUserStore from '../../../stores/CurrentUserStore';
import './SingleMessage.css';

interface IMessageProps {
    message: Message;
}

const SingleMessage: React.FunctionComponent<IMessageProps> = ({ message }) => {
    const sentByCurrentUser = message.user.id === CurrentUserStore.user?.id;

    return useObserver(() => (
        <div className="single-message__container">
            <div className="single-message__content">{message.content}</div>
            <div className="single-message__info">
                <div className="single-message__timestamp">
                    {format(message.dateCreated, 'time')}
                </div>
                <div className="single-message__options">
                    {sentByCurrentUser ? (
                        <div
                            className="single-message__button"
                            onClick={() => console.log('Edit message')}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </div>
                    ) : (
                        <div
                            className="single-message__button"
                            onClick={() => console.log('Star message')}
                        >
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                    )}
                    <div
                        className="single-message__button"
                        onClick={() => console.log('Open menu')}
                    >
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default SingleMessage;
