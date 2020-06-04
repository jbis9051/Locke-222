import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


// We can probably eventually remove the old DOM but for now we'll keep it

const body = document.getElementById('chat-body')!;

for (let child of body.children) {
    (child as HTMLElement).style.display = 'none';
}

document.querySelectorAll('script').forEach((scriptTag) => scriptTag.remove()); // this is unnecessary

const root = document.createElement('div');
root.id = 'locke-root';

body.appendChild(root);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    root
);
