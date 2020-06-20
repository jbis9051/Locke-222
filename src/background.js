// eslint-ignore
// this file left intentionally blank
const chrome = window.chrome || {}; // webpack webpack webpack

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.url.includes('master-chat.js')) {
            return { cancel: true };
        }
    },
    { urls: ['*://cdn-chat.sstatic.net/chat/Js/*'] },
    ['blocking']
);
