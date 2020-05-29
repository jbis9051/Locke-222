import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import pageScript from "./pageScript";
import {PageJSData} from "./interfaces/PageJSData";
import Initializer from "./controllers/Initializer";

// We can probably eventually remove the old DOM but for now we'll keep it

const body = document.getElementById('chat-body')!;

for (let child of body.children) {
    (child as HTMLElement).style.display = 'none';
}

// We don't want SO's scripts running. It sometimes adds elements to the body avoiding our display none logic above */
document.querySelectorAll('script').forEach(scriptTag => scriptTag.remove());

const injectionScriptEl = document.createElement('script');
injectionScriptEl.innerHTML = `(${pageScript.toString()})()`; // This is disgusting
body.appendChild(injectionScriptEl); // I don't really understand, but apparently this executes before the next line
const data: PageJSData = JSON.parse((document.querySelector('#__locke-info')! as HTMLInputElement).value);

Initializer(data);

// we'll use this data eventually

const root = document.createElement('div');
root.id = 'locke-root';

body.appendChild(root);

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    root
);
