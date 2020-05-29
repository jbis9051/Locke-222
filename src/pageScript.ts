export default (function () {
    const el = document.createElement('input');
    el.hidden = true;
    el.id = "__locke-info";

    el.value = JSON.stringify({
        // @ts-ignore
        users: CHAT.RoomUsers.allPresent().toArray()
    });
    document.querySelector("body")!.append(el);
})
