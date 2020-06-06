import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'mobx-react/batchingForReactDom';

// We can probably eventually remove the old DOM but for now we'll keep it

const body = document.getElementById('chat-body')!;

for (let child of body.children) {
    (child as HTMLElement).style.display = 'none';
}

document.querySelectorAll('script, link').forEach((scriptTag) => scriptTag.remove()); // this is unnecessary

const root = document.createElement('div');
root.id = 'locke-root';

const font = document.createElement('link');
font.href =
    'https://fonts.googleapis.com/css?family=Inter:100,200,300,400,500,600,700,800,900&display=swap';
font.setAttribute('rel', 'stylesheet');

document.querySelector('head')!.appendChild(font);

body.appendChild(root);

console.clear();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    root
);
