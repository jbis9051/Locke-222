import formEncoder from '../helpers/formEncoder';
import RoomStore from '../stores/RoomStore';
import { UserObject } from '../interfaces/UserObject';
import User from '../models/User';
import { parse } from 'node-html-parser';
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
} from '../interfaces/APIResponses';
import UserStore from '../stores/UserStore';
import { RoomObject } from '../interfaces/RoomObject';
import CurrentUserStore from '../stores/CurrentUserStore';
import UIStore from '../stores/UIStore';
import { MainWindowState } from '../interfaces/UIStates';
import { PingableUserObject } from '../interfaces/PingableUserObject';

class IO {
    private fkey: string;
    private ws: WebSocket | null = null;

    constructor(fkey: string) {
        this.fkey = fkey;
        this.refreshFavoriteRooms();
    }

    async changeRoom(roomId: number, force: boolean = false) {
        if (!force && roomId === RoomStore.id) {
            return;
        }
        RoomStore.id = roomId;
        await this.setUpWS();
        this.refreshPingable();
        await Promise.all([this.setUpRoomInfo(), this.setUpRoomMembers()]);
        CurrentUserStore.addToRecent({ id: RoomStore.id, name: RoomStore.name });
        await Promise.all([this.setUpPreviousMessages(), this.setUpRecentStars()]);
    }

    // ---- SETUP --- //

    async setUpWS() {
        const data = await fetch('/ws-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                roomid: RoomStore.id,
                fkey: this.fkey,
            }),
        }).then((resp) => resp.json());

        const wsURL = data.url;
        const ws = new WebSocket(wsURL + '?l=99999999999'); // https://github.com/jbis9051/JamesSOBot/blob/master/docs/CHAT_API.md#obtaining-the-l-param
        ws.addEventListener('message', (event) => {
            this.handleMessage(JSON.parse(event.data));
        });
        ws.addEventListener('error', (event) => {
            console.error(`WebSocket Closed: ${JSON.stringify(event)}`);
            //this.setUpWS();
        });
        ws.addEventListener('close', (event) => {
            console.log(`WebSocket Closed: ${JSON.stringify(event)}`);
            //this.setUpWS();
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
        let code: string = '';
        doc.querySelectorAll('script').forEach((element) => {
            const innerHTML = element.rawText;
            if (innerHTML.includes('CHAT.RoomUsers.initPresent')) {
                code = innerHTML;
            }
        });
        let members: UserObject[];
        const CHAT = {
            RoomUsers: {
                initPresent: (peoples: UserObject[]) => {
                    members = peoples;
                },
                update: () => {}, // this maybe important, not sure
            },
        };

        let SERVER_TIME_OFFSET = 0;
        const $ = (func: any) => {
            func();
        };
        let currentUser: number = 0;
        const StartChat = (_: any, currentUserId: number) => {
            currentUser = currentUserId;
        };
        eval(code);

        RoomStore.clearUsers();
        UserStore.clearStore();

        // @ts-ignore
        members
            .map((userObject) => User.fromUserObject(userObject))
            .forEach((user) => RoomStore.addUser(user));

        if (currentUser > 0) {
            CurrentUserStore.user = await UserStore.getUserById(currentUser);
        }
    }

    async setUpRoomInfo() {
        const data: RoomInfoResponse = await fetch(`/rooms/thumbs/${RoomStore.id}`).then((resp) =>
            resp.json()
        );
        RoomStore.name = data.name;
        RoomStore.description = data.description;
    }

    async refreshFavoriteRooms() {
        const html = await fetch(`/?tab=favorite&sort=active`).then((resp) => resp.text());
        const doc = parse(html);

        if (doc.querySelectorAll('.favorite-room').length === 0) {
            return [];
        }
        const rooms: RoomObject[] = doc.querySelectorAll('.roomcard').map((room) => {
            const id = parseInt(room.id.match(/[0-9]+/)![0]);
            const name = room.querySelector('.room-name').getAttribute('title');
            return {
                id,
                name,
            };
        });
        CurrentUserStore.setFavoriteRooms(rooms);
    }

    async refreshPingable() {
        const data: PingableResponse = await fetch(`/rooms/pingable/${RoomStore.id}`).then((resp) =>
            resp.json()
        );
        RoomStore.pingable = data.map<PingableUserObject>((pingable) => ({
            id: pingable[0],
            name: pingable[1],
            last_seen: pingable[2],
            last_message: pingable[3],
        }));
    }

    async setUpPreviousMessages(): Promise<void> {
        RoomStore.clearMessages();
        const response = await fetch(`/chats/${RoomStore.id}/events`, {
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
        const data = (await response.json()) as EventsResponse;
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
                return this.getMessage(parseInt(li.id.match(/[0-9]+/)![0]));
            })
        );

        RoomStore.addStar(...(stars.filter((star) => !!star) as any));
    }

    // ---- EVENT HANDLERS --- //

    async handleMessage(event: WebSocketEvent) {
        const roomKey = `r${RoomStore.id}`;
        if (!event.hasOwnProperty(roomKey)) {
            return;
        }
        if (!event[roomKey].hasOwnProperty('e')) {
            return;
        }
        const events = (event[roomKey] as RoomEvent).e;

        const eventFunctions = {
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

        events.forEach((anEvent: Event) => {
            if (eventFunctions.hasOwnProperty(anEvent.event_type)) {
                // @ts-ignore
                eventFunctions[anEvent.event_type](anEvent);
            }
        });
    }

    // ---- OUT --- //

    async send(content: string) {
        const resp = await fetch(`/chats/${RoomStore.id}/messages/new`, {
            method: 'POST',
            body: formEncoder({
                text: content,
                fkey: this.fkey,
            }),
        });
        const data = await resp.text();
        if (resp.status === 200) {
            return true;
        }
        throw data;
    }

    async edit(id: number, newContent: string) {
        const resp = await fetch(`/messages/${id}`, {
            method: 'POST',
            body: formEncoder({
                text: newContent,
                fkey: this.fkey,
            }),
        });
        const data = await resp.text();
        if (resp.status === 200) {
            return true;
        }
        throw data;
    }

    async starMessageToggle(messageId: number) {
        const resp = await fetch(`/messages/${messageId}/star`, {
            method: 'POST',
            body: formEncoder({
                fkey: this.fkey,
            }),
        });
        const data = await resp.text();
        if (resp.status === 200) {
            return true;
        }
        throw data;
    }

    // ---- IN --- //

    async getUserInfo(userId: number): Promise<UserObject> {
        const data: UserInfoResponse = await fetch('/user/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                ids: userId,
                roomId: RoomStore.id,
            }),
        }).then((resp) => resp.json());

        return data.users[0];
    }

    async getUserThumb(userId: number): Promise<ThumbsResponse> {
        return await fetch(`/users/thumbs/${userId}`).then((resp) => resp.json());
    }

    async getMessage(messageId: number): Promise<Message | null> {
        const data: EventsResponse = await fetch(`/chats/${RoomStore.id}/events`, {
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
        }).then((resp) => resp.json());

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
}

const fkey = (document.querySelector('#fkey')! as HTMLInputElement).value;
export default new IO(fkey);
