// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
window.chrome.webRequest.onBeforeRequest.addListener(
    ({ url }) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        cancel: url.includes('master-chat.js'),
    }),
    { urls: ['*://cdn-chat.sstatic.net/chat/Js/*'] },
    ['blocking']
);
