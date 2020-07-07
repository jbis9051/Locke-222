import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import './App.css';
import IO from './controllers/IO';
import '@fortawesome/fontawesome-svg-core/styles.css';
import RoomSelectorPanel from './components/RoomSelector/RoomSelectorPanel';
import RoomWindow from './components/RoomWindow/RoomWindow';
import UIStore from './stores/UIStore';
import Modal from './components/Modal/Modal';
import RoomStore from './stores/RoomStore';
import Spinner from './components/Util/Spinner';

function App(): React.ReactElement {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        IO.changeRoom(parseInt(/\/rooms\/([0-9]+)\//.exec(window.location.href)![1], 10))
            .then(() => setIsReady(true))
            .catch(console.error);
    }, []);

    return useObserver(() => (
        <div className="main-app-wrapper">
            {isReady ? (
                <div className="app-container">
                    <RoomSelectorPanel />
                    <RoomWindow />
                    {UIStore.descriptionModal && (
                        <Modal
                            onClick={() => {
                                UIStore.descriptionModal = false;
                            }}
                        >
                            <h2>{RoomStore.name}</h2>
                            <span>{RoomStore.description}</span>
                        </Modal>
                    )}
                </div>
            ) : (
                <div className="loader">
                    <Spinner />
                </div>
            )}
        </div>
    ));
}

export default App;
