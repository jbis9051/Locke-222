import React, { useEffect, useState } from 'react';
import './App.css';
import IO from './controllers/IO';
import '@fortawesome/fontawesome-svg-core/styles.css';
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
                <div className={'app-container'}>
                    <RoomSelectorPanel />
                    <RoomWindow />
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
