import React, { useEffect, useState } from 'react';
import './App.css';
import IO from './controllers/IO';
import '@fortawesome/fontawesome-svg-core/styles.css';
import RoomSelectorPanel from './components/RoomSelector/RoomSelectorPanel';
import RoomWindow from './components/RoomWindow/RoomWindow';
import UIStore from './stores/UIStore';
import Modal from './components/Modal/Modal';
import RoomStore from './stores/RoomStore';
import { useObserver } from 'mobx-react';

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        IO.changeRoom(parseInt(window.location.href.match(/\/rooms\/([0-9]+)\//)![1])).then(() =>
            setIsReady(true)
        );
    }, []);

    return useObserver(() => (
        <div className="main-app-wrapper">
            {isReady ? (
                <div className={'app-container'}>
                    <RoomSelectorPanel />
                    <RoomWindow />
                    {UIStore.descriptionModal && (
                        <Modal onClick={() => (UIStore.descriptionModal = false)}>
                            <h2>{RoomStore.name}</h2>
                            <span>{RoomStore.description}</span>
                        </Modal>
                    )}
                </div>
            ) : (
                <div className={'loader'}>
                    <span>Loading...</span>
                </div>
            )}
        </div>
    ));
}

export default App;
