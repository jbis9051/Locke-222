import formEncoder from '../helpers/formEncoder';
import RoomStore from '../stores/RoomStore';
import { UserObject } from '../interfaces/UserObject';
import User from '../models/User';
import { parse } from 'node-html-parser';
import {
    EventType,
    MessageEvent,
    RoomEvent,
    UserJoinEvent,
    WebSocketEvent,
} from '../interfaces/WebSocketEvent';
import Message from '../models/Message';
import { RoomInfoResponse, UserInfoResponse } from '../interfaces/APIResponses';
import UserStore from '../stores/UserStore';

class IO {
    private fkey: string;
    private ws: WebSocket | null = null;

    constructor(fkey: string) {
        this.fkey = fkey;
    }

    async init(roomId: number) {
        RoomStore.id = roomId;
        await this.setUpWS();
        await this.setUpRoomInfo();
        await this.setUpRoomMembers();
    }

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
            console.error(`WebSocket Errored: ${event.toString()}`);
            //this.setUpWS();
        });
        ws.addEventListener('close', (event) => {
            console.error(`WebSocket Closed: ${event.toString()}`);
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
            },
        };

        let SERVER_TIME_OFFSET = 0;
        const $ = (func: any) => {
            func();
        };
        const StartChat = () => {};
        eval(code);

        // @ts-ignore
        members
            .map((userObject) => User.fromUserObject(userObject))
            .forEach((user) => RoomStore.addUser(user));
    }

    async setUpRoomInfo() {
        const data: RoomInfoResponse = await fetch(`/rooms/thumbs/${RoomStore.id}`).then((resp) =>
            resp.json()
        );
        RoomStore.name = data.name;
        RoomStore.description = data.description;
    }

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
            [EventType.NEW_MESSAGE]: (event: MessageEvent) => {
                const user = RoomStore.getUserById(event.user_id);
                if (!user) {
                    return;
                }
                RoomStore.addMessage(new Message(event.message_id, user, event.content));
            },
            [EventType.USER_JOIN]: async (event: UserJoinEvent) => {
                const user = await UserStore.getUserById(event.user_id);
                RoomStore.addUser(user);
            },
            [EventType.USER_LEAVE]: (event: UserJoinEvent) => {
                RoomStore.removeUser(event.user_id);
            },
        };

        events.forEach((roomEvent) => {
            if (eventFunctions.hasOwnProperty(roomEvent.event_type)) {
                eventFunctions[roomEvent.event_type](roomEvent as any);
            }
        });
    }

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

    async getUserInfo(userId: number): Promise<UserObject> {
        const data: UserInfoResponse = await fetch('/user/info', {
            method: 'POST',
            body: formEncoder({
                ids: userId,
                roomId: RoomStore.id,
            }),
        }).then((resp) => resp.json());

        return data.users[0];
    }
}

const fkey = (document.querySelector('#fkey')! as HTMLInputElement).value;
export default new IO(fkey);
