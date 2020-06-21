import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faGrinAlt } from '@fortawesome/free-solid-svg-icons/faGrinAlt';
import { useObserver } from 'mobx-react';
import './MessageInput.css';
import RoomStore from '../../../stores/RoomStore';

interface IInputButtonProps {
    icon: IconDefinition;
    onClick(): void;
}

interface IMessageInputProps {
    showControls?: boolean;
}

const InputButton: React.FunctionComponent<IInputButtonProps> = ({ icon, onClick }) => (
    <div
        className="message-input__btn"
        onClick={() => onClick()}
        // prevent double-click selection
        onMouseDown={(e) => e.preventDefault()}
    >
        <FontAwesomeIcon icon={icon} size="lg" />
    </div>
);

const MessageInput: React.FunctionComponent<IMessageInputProps> = ({ showControls }) => {
    const [draft, setDraft] = useState('');

    function sendMessage(): void {
        console.log(`Message send STUB: ${draft}`);
        setDraft('');
    }

    return useObserver(() => (
        <div className="message-input__box">
            {showControls ? (
                <>
                    <InputButton
                        icon={faPlusCircle}
                        onClick={() => console.log('Insert file STUB')}
                    />
                </>
            ) : (
                <></>
            )}
            <input
                className="message-input__text"
                type="text"
                placeholder={`Message ${RoomStore.name}`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            {showControls ? (
                <>
                    <InputButton icon={faSearch} onClick={() => console.log('Gif search STUB')} />
                    <InputButton
                        icon={faGrinAlt}
                        onClick={() => console.log('Emoji selection STUB')}
                    />
                </>
            ) : (
                <></>
            )}
        </div>
    ));
};

export default MessageInput;
