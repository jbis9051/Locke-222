import formEncoder from "../helpers/formEncoder";
import RoomStore from "../stores/RoomStore";
import {reaction} from "mobx";
import {UserObject} from "../interfaces/UserObject";
import User from "../models/User";

class IO {
    private fkey: string;
    private ws: WebSocket | null = null;

    constructor(fkey: string) {
        this.fkey = fkey;
        //reaction(() => RoomStore.id, () => this.init()); // When the room id changes reinitialize

    }

    async init(){
        await this.setUpWS();
        await this.setUpRoomMembers();
    }

    async setUpWS(){
        const data = await fetch('/ws-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formEncoder({
                roomid: RoomStore.id,
                fkey: this.fkey,
            })
        }).then(resp => resp.json());

        const wsURL = data.url;
        const ws = new WebSocket(wsURL + "?l=99999999999"); // https://github.com/jbis9051/JamesSOBot/blob/master/docs/CHAT_API.md#obtaining-the-l-param
        ws.addEventListener("message", (event) => {
            this.handleMessage(JSON.parse(event.data))
        });
        ws.addEventListener("error", (event) => {
            console.error(`WebSocket Errored: ${event.toString()}`);
            //this.setUpWS();
        });
        ws.addEventListener("close", (code) => {
            console.error(`WebSocket Closed: ${code}`);
            this.setUpWS();
        });
        if(this.ws){
            this.ws.close();
        }
        this.ws = ws;
    }

    async setUpRoomMembers(){
        // We need to get the room members. Unfortunately, the only AJAX
        // requests that are available don't give us enough information.
        // So, we parse HTML and JS with regex!

        const roomMembersRegex = /CHAT.RoomUsers.initPresent\(([\s\S]*)\);/;
        const html = await fetch(`/rooms/${RoomStore.id}`).then(resp => resp.text());
        const members: UserObject[] = JSON.parse(html.match(roomMembersRegex)![1]);
        members
            .map(userObject => User.fromUserObject(userObject))
            .forEach(user => RoomStore.addUser(user));
    }

    async handleMessage(data: any){
        
    }
}
const fkey = (document.querySelector('#fkey')! as HTMLInputElement).value;
export default  new IO(fkey);
