import { parse } from 'node-html-parser';
import formEncoder from '../helpers/formEncoder';
import RoomStore from '../stores/RoomStore';
import { UserObject } from '../interfaces/UserObject';
import User from '../models/User';
import {
    Event,
    EventType,
    MessageEvent,
    RoomEvent,
    UserJoinEvent,
    WebSocketEvent,
} from '../interfaces/WebSocketEvent';
import Message from '../models/Message';
import {
    EventsResponse,
    PingableResponse,
    RoomInfoResponse,
    ThumbsResponse,
    UserInfoResponse,
    WebSocketAuthResponse,
} from '../interfaces/APIResponses';
import UserStore from '../stores/UserStore';
import { RoomObject } from '../interfaces/RoomObject';
import CurrentUserStore from '../stores/CurrentUserStore';
import { PingableUserObject } from '../interfaces/PingableUserObject';
import { StarFilter } from '../interfaces/StarFilter';
import { fetchJsonAsType, isNotNullish } from '../helpers/typeUtils';

class IO {
    private readonly fkey: string;

    private ws: WebSocket | null = null;

    constructor(fkey: string) {
        this.fkey = fkey;
        this.refreshFavoriteRooms().catch(console.error);
    }

    async changeRoom(roomId: number, force = false) {
        if (!force && roomId === RoomStore.id) {
            return;
        }
        RoomStore.id = roomId;
        await this.setUpWS();
        this.refreshPingable().catch(console.error);
        await Promise.all([this.setUpRoomInfo(), this.setUpRoomMembers()]);
        CurrentUserStore.addToRecent({ id: RoomStore.id, name: RoomStore.name });
        await Promise.all([this.setUpPreviousMessages(), this.setUpRecentStars()]);
    }

    // ---- SETUP --- //

    async setUpWS() {
        const data = await fetchJsonAsType<WebSocketAuthResponse>('/ws-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                roomid: RoomStore.id,
                fkey: this.fkey,
            }),
        });

        const wsURL = data.url;
        const ws = new WebSocket(`${wsURL}?l=99999999999`); // https://github.com/jbis9051/JamesSOBot/blob/master/docs/CHAT_API.md#obtaining-the-l-param
        ws.addEventListener('message', (event) => {
            this.handleMessage(JSON.parse(event.data));
        });
        ws.addEventListener('error', (event) => {
            console.error(`WebSocket Closed: ${JSON.stringify(event)}`);
            // this.setUpWS();
        });
        ws.addEventListener('close', (event) => {
            console.log(`WebSocket Closed: ${JSON.stringify(event)}`);
            // this.setUpWS();
        });
        if (this.ws) {
            this.ws.close();
        }
        this.ws = ws;
    }

    async setUpRoomMembers() {
        // We need to get the room members. Unfortunately, the only AJAX
        // requests that are available don't give us enough information.
        // So we do this.

        const html = await fetch(`/rooms/${RoomStore.id}`).then((resp) => resp.text());
        const doc = parse(html, { script: true });
        let code = '';
        doc.querySelectorAll('script').forEach((element) => {
            const innerHTML = element.rawText;
            if (innerHTML.includes('CHAT.RoomUsers.initPresent')) {
                code = innerHTML;
            }
        });
        let members: UserObject[] = [];
        const CHAT = {
            RoomUsers: {
                initPresent: (peoples: UserObject[]) => {
                    members = peoples;
                },
                update: () => {}, // this maybe important, not sure
            },
        };

        // eslint-disable-next-line prefer-const
        let SERVER_TIME_OFFSET = 0;
        const $ = (func: () => void) => {
            func();
        };
        let currentUser = 0;
        const StartChat = (_: never, currentUserId: number) => {
            currentUser = currentUserId;
        };
        // eslint-disable-next-line no-eval
        eval(code);

        RoomStore.clearUsers();
        UserStore.clearStore();

        members
            .map((userObject) => User.fromUserObject(userObject))
            .forEach((user) => RoomStore.addUser(user));

        if (currentUser > 0) {
            CurrentUserStore.user = await UserStore.getUserById(currentUser);
        }
    }

    async setUpRoomInfo() {
        const data: RoomInfoResponse = await fetchJsonAsType(`/rooms/thumbs/${RoomStore.id}`);
        RoomStore.isFavorite = data.isFavorite;
        RoomStore.name = data.name;
        RoomStore.description = data.description;
    }

    async refreshFavoriteRooms() {
        const html = await fetch(`/?tab=favorite&sort=active`).then((resp) => resp.text());
        const doc = parse(html);

        if (doc.querySelectorAll('.favorite-room').length === 0) {
            return;
        }
        const rooms: RoomObject[] = doc.querySelectorAll('.roomcard').map((room) => {
            const id = parseInt(/[0-9]+/.exec(room.id)![0], 10);
            const name = room.querySelector('.room-name').getAttribute('title');
            return {
                id,
                name,
            };
        });
        CurrentUserStore.setFavoriteRooms(rooms);
    }

    async refreshPingable() {
        const data: PingableResponse = await fetchJsonAsType(`/rooms/pingable/${RoomStore.id}`);
        RoomStore.pingable = data.map<PingableUserObject>((pingable) => ({
            id: pingable[0],
            name: pingable[1],
            last_seen: pingable[2],
            last_message: pingable[3],
        }));
    }

    async setUpPreviousMessages(): Promise<void> {
        RoomStore.clearMessages();
        const data = await fetchJsonAsType<EventsResponse>(`/chats/${RoomStore.id}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                since: 0,
                mode: 'Messages',
                msgCount: 100,
                fkey: this.fkey,
            }),
        });
        const messages: Message[] = [];
        for (const event of data.events) {
            const message = await Message.fromEvent(event);
            if (message) messages.push(message);
        }
        RoomStore.addMessage(...messages);
    }

    async setUpRecentStars() {
        RoomStore.clearStars();
        const html = await fetch(`/chats/stars/${RoomStore.id}`).then((resp) => resp.text());
        const doc = parse(html);

        const stars: (Message | null)[] = await Promise.all(
            doc.querySelectorAll('li').map((li) => {
                return this.getMessage(parseInt(/[0-9]+/.exec(li.id)![0], 10));
            })
        );

        RoomStore.addStar(...stars.filter(isNotNullish));
    }

    // ---- EVENT HANDLERS --- //

    handleMessage(wsEvent: WebSocketEvent) {
        const roomKey = `r${RoomStore.id}`;
        if (!wsEvent.hasOwnProperty(roomKey)) {
            return;
        }
        if (!wsEvent[roomKey].hasOwnProperty('e')) {
            return;
        }
        const events = (wsEvent[roomKey] as RoomEvent).e;

        // eslint-disable-next-line @typescript-eslint/ban-types
        const eventFunctions: Partial<Record<EventType, Function>> = {
            [EventType.NEW_MESSAGE]: async (event: MessageEvent) => {
                const message = await Message.fromEvent(event);
                if (message) RoomStore.addMessage(message);
            },
            [EventType.USER_JOIN]: async (event: UserJoinEvent) => {
                const user = await UserStore.getUserById(event.user_id);
                RoomStore.addUser(user);
            },
            [EventType.USER_LEAVE]: (event: UserJoinEvent) => {
                RoomStore.removeUser(event.user_id);
            },
        };

        events.forEach((event: Event) => {
            eventFunctions[event.event_type]?.(event);
        });
    }

    // ---- OUT --- //

    async send(content: string) {
        const resp = await fetch(`/chats/${RoomStore.id}/messages/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                text: content,
                fkey: this.fkey,
            }),
        });
        if (resp.status !== 200) {
            const data = await resp.text();
            throw new Error(data);
        }
    }

    async edit(id: number, newContent: string) {
        const resp = await fetch(`/messages/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                text: newContent,
                fkey: this.fkey,
            }),
        });
        const data = await resp.text();
        if (resp.status === 200) {
            return true;
        }
        throw new Error(data);
    }

    async starMessageToggle(messageId: number) {
        const resp = await fetch(`/messages/${messageId}/star`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                fkey: this.fkey,
            }),
        });
        const data = await resp.text();
        if (resp.status === 200) {
            return true;
        }
        throw new Error(data);
    }

    // ---- IN --- //

    async getUserInfo(userId: number): Promise<UserObject> {
        const data: UserInfoResponse = await fetchJsonAsType('/user/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                ids: userId,
                roomId: RoomStore.id,
            }),
        });

        return data.users[0];
    }

    getUserThumb(userId: number): Promise<ThumbsResponse> {
        return fetchJsonAsType(`/users/thumbs/${userId}`);
    }

    async getMessage(messageId: number): Promise<Message | null> {
        const data: EventsResponse = await fetchJsonAsType(`/chats/${RoomStore.id}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                before: messageId + 1, // we add one to get the message event right before it which should be the messageId
                mode: 'Messages',
                msgCount: 1,
                fkey: this.fkey,
            }),
        });

        const messageEvent = data.events[0];

        if (!messageEvent) {
            return null;
        }

        const message = await Message.fromEvent(messageEvent);

        if (message.id !== messageId) {
            return null;
        }

        return message;
    }

    async getStars(page: number, filter: StarFilter): Promise<Message[]> {
        const html = await fetch(
            `/rooms/info/${RoomStore.id}/?tab=stars&filter=${filter}&page=${page}`
        ).then((resp) => resp.text());
        const doc = parse(html);
        const messsageIds = doc
            .querySelectorAll('.monologue')
            .map((monologue) =>
                parseInt(/[0-9]+/.exec(monologue.querySelector('.message').id)![0], 10)
            );
        return (
            await Promise.all(messsageIds.map((messageId) => this.getMessage(messageId)))
        ).filter((message) => !!message) as Message[];
    }
}

const fkey = (document.querySelector('#fkey')! as HTMLInputElement).value;
export default new IO(fkey);
