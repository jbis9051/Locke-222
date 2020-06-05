import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import IO from './controllers/IO';
import User from './models/User';
import RoomStore from './stores/RoomStore';
import "@fortawesome/fontawesome-svg-core/styles.css";
import RoomSelectorPanel from './components/RoomSelector/RoomSelectorPanel';
import RoomWindow from './components/RoomWindow/RoomWindow';

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
                    <RoomWindow/>
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
