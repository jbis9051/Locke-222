import React, { CSSProperties, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faGrinAlt } from '@fortawesome/free-solid-svg-icons/faGrinAlt';
import { useObserver } from 'mobx-react';
import './MessageInput.css';
import IO from '../../../controllers/IO';
import RoomStore from '../../../stores/RoomStore';

interface IInputButtonProps {
    icon: IconDefinition;
    onClick(): void;
    style?: CSSProperties;
}

interface IMessageInputProps {
    showControls?: boolean;
}

const InputButton: React.FunctionComponent<IInputButtonProps> = ({ icon, onClick, style }) => (
    <div
        className="message-input__btn"
        onClick={() => onClick()}
        style={style}
        // prevent double-click selection
        onMouseDown={(e) => e.preventDefault()}
    >
        <FontAwesomeIcon icon={icon} size="lg" />
    </div>
);

const MessageInput: React.FunctionComponent<IMessageInputProps> = ({ showControls }) => {
    const [draft, setDraft] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!error) return () => {};
        const timer = setTimeout(() => {
            setError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [error]);

    async function sendMessage(): Promise<void> {
        console.log(`Message send: ${draft}`);
        setLoading(true);
        try {
            await IO.send(draft);
            setDraft('');
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return useObserver(() => (
        <div className="message-input__box">
            {showControls && (
                <>
                    <InputButton
                        icon={faPlusCircle}
                        onClick={() => console.log('Insert file STUB')}
                        style={{ visibility: loading ? 'hidden' : 'visible' }}
                    />
                </>
            )}
            <input
                className="message-input__text"
                type="text"
                placeholder={`Message ${RoomStore.name}`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            {showControls && (
                <>
                    <InputButton icon={faSearch} onClick={() => console.log('Gif search STUB')} />
                    <InputButton
                        icon={faGrinAlt}
                        onClick={() => console.log('Emoji selection STUB')}
                    />
                </>
            )}
            {loading && (
                <div className="message-input__loading">
                    <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />
                </div>
            )}
            {error && <div className="message-input__error">{error}</div>}
        </div>
    ));
};

export default MessageInput;
