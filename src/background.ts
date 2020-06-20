window.chrome.webRequest.onBeforeRequest.addListener(
    ({ url }) => ({
        cancel: url.includes('master-chat.js'),
    }),
    { urls: ['*://cdn-chat.sstatic.net/chat/Js/*'] },
    ['blocking']
);
