import formEncoder from "../helpers/formEncoder";
import RoomStore from "../stores/RoomStore";
import {reaction} from "mobx";
import {UserObject} from "../interfaces/UserObject";
import User from "../models/User";
import cheerio from 'cheerio';

class IO {
    private fkey: string;
    private ws: WebSocket | null = null;

    constructor(fkey: string) {
        this.fkey = fkey;
        //reaction(() => RoomStore.id, () => this.init()); // When the room id changes reinitialize

    }


    async init(roomId: number) {
        RoomStore.id = roomId;
        await this.setUpWS();
        await this.setUpRoomInfo();
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
            //this.setUpWS();
        });
        if(this.ws){
            this.ws.close();
        }
        this.ws = ws;
    }

    async setUpRoomMembers(){
        // We need to get the room members. Unfortunately, the only AJAX
        // requests that are available don't give us enough information.
        // So we do this.

        const html = await fetch(`/rooms/${RoomStore.id}`).then(resp => resp.text());
        const $_ = cheerio.load(html);
        let code: string = "";
        $_('script').each((i, element) => {
            const innerHTML = $_(element).html()!;
            if(innerHTML.includes('CHAT.RoomUsers.initPresent')){
                code = innerHTML;
            }
        })
        let members: UserObject[];
        const CHAT = {
            RoomUsers: {
                initPresent: (peoples: UserObject[]) => {
                    members = peoples;
                }
            }
        }

        let SERVER_TIME_OFFSET  = 0;
        const $ = (func: any) => { func() };
        const StartChat = () => {};
        eval(code);

        // @ts-ignore
        members
            .map(userObject => User.fromUserObject(userObject))
            .forEach(user => RoomStore.addUser(user));
    }

    async setUpRoomInfo(){
        const data = await fetch(`/rooms/thumbs/${RoomStore.id}`).then(resp => resp.json());
        RoomStore.name = data.name;
        RoomStore.description = data.description;
    }

    async handleMessage(data: any){

    }
}
const fkey = (document.querySelector('#fkey')! as HTMLInputElement).value;
export default  new IO(fkey);
