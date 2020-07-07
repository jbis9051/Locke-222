import './StarsChannel.css';
import React, { useEffect, useState } from 'react';
import { reaction } from 'mobx';
import IO from '../../../controllers/IO';
import { StarFilter } from '../../../interfaces/StarFilter';
import Message from '../../../models/Message';
import MessageGroup from '../Chat/MessageGroup';
import RoomStore from '../../../stores/RoomStore';
import Spinner from '../../Util/Spinner';

export default function StarsChannel({ filter }: { filter: StarFilter }): React.ReactElement {
    // all the stars, not all-stars--you know what i mean
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [page, setPage] = useState(1);

    function updateStars() {
        setMessages(null);
        IO.getStars(page, filter).then(setMessages).catch(console.error);
    }

    useEffect(updateStars, [page, filter]);

    reaction(() => RoomStore.id, updateStars); // update when the room changes

    if (!messages) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Spinner />
            </div>
        );
    }

    return (
        <div className="stars-channel-wrapper">
            {messages.map((message) => (
                <MessageGroup key={message.id} messages={[message]} />
            ))}
        </div>
    );
}
