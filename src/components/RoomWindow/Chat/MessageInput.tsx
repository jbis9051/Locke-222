import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
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
import User from '../../../models/User';
import UserStore from '../../../stores/UserStore';
import UserItem from '../UserItem';

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
    const [mentions, setMentions] = useState<User[]>([]);
    const [selectionLocation, setSelectionLocation] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelectionChange = useCallback(() => {
        if (!inputRef.current) {
            setMentions([]);
            return;
        }
        const inputElement = inputRef.current;
        if (inputElement.selectionStart !== inputElement.selectionEnd) {
            // they are selecting something we don't want to bother them
            setMentions([]);
            return;
        }
        const latestAtIndex = draft.lastIndexOf('@', inputElement.selectionStart! - 1);
        if (latestAtIndex === -1) {
            setMentions([]);
            return;
        }
        const indexOfNextSpace = draft.indexOf(' ', latestAtIndex);
        if (indexOfNextSpace > 0 && indexOfNextSpace < inputElement.selectionStart!) {
            setMentions([]);
            return;
        }
        const searchString = draft.substring(
            latestAtIndex,
            indexOfNextSpace > 0 ? indexOfNextSpace : undefined
        );
        setMentions(UserStore.filterByMentionString(searchString).slice(0, 5));
    }, [draft]);

    function handleMentionSelection(user: User) {
        if (!inputRef.current) {
            setMentions([]);
            return;
        }
        const latestAtIndex = draft.lastIndexOf('@', inputRef.current.selectionStart! - 1);
        const indexOfNextSpace = draft.indexOf(' ', latestAtIndex);
        const firstPart = `${draft.substring(0, latestAtIndex + 1)}${user.mentionString}`;
        if (indexOfNextSpace > 0) {
            setDraft(firstPart + draft.substring(indexOfNextSpace));
        } else {
            setDraft(firstPart);
        }
        setSelectionLocation(firstPart.length + 1);
    }

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.focus();
        inputRef.current.setSelectionRange(selectionLocation, selectionLocation);
        handleSelectionChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectionLocation]);

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
            {mentions.length > 0 && (
                <div className="mention-container">
                    <div className="mention-wrapper">
                        {mentions.map((mention) => (
                            <div
                                onClick={() => handleMentionSelection(mention)}
                                key={mention.id}
                                className="mention-container__mention"
                            >
                                <UserItem
                                    user={mention}
                                    displayAvatar
                                    displayName
                                    popupDirection={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
                ref={inputRef}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                onKeyUp={handleSelectionChange}
                onClick={handleSelectionChange}
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
