// this file left intentionally blank
const chrome = window.chrome || {}; // webpack webpack webpack

chrome.webRequest.onBeforeRequest.addListener((details) => {
    return {cancel: true};
}, {urls: ["*://cdn-chat.sstatic.net/chat/*"]}, ["blocking"]);
