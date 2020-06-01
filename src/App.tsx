import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import IO from "./controllers/IO";
import User from "./models/User";
import RoomStore from "./stores/RoomStore";

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        IO.init(parseInt(window.location.href.match(/\/rooms\/([0-9]+)\//)![1])).then(() => setIsReady(true));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
