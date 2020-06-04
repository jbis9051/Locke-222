import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import IO from './controllers/IO';
import User from './models/User';
import RoomStore from './stores/RoomStore';
import RoomSelectorPanel from './components/RoomSelectorPanel';

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        IO.init(parseInt(window.location.href.match(/\/rooms\/([0-9]+)\//)![1])).then(() =>
            setIsReady(true)
        );
    }, []);

    return (
        <div className="main-app-wrapper">
            {isReady ? (
                <div className={"app-container"}>
                    <RoomSelectorPanel/>
                    <div className={"room-window"}>
                        <div className={"left-menu"}></div>
                        <div className={"main-chat-window"}></div>
                        <div className={"users-list"}></div>
                    </div>
                </div>
            ) : (
                <div className={'loader'}>
                    <span>Loading...</span>
                </div>
            )}
        </div>
    );
}

export default App;
