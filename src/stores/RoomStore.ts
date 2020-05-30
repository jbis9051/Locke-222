import {observable} from "mobx";
import User from "../models/User";
import Message from "../models/Message";

class RoomStore {
    get id(): number {
        return this._id;
    }

    @observable private _id: number = 0;
    @observable private name: string = "";
    @observable private description: string = "";
    @observable private users: User[] = [];
    @observable private messages: Message[] = [];

    addUser(user: User){
        this.users.push(user);
    }
}

export default new RoomStore();
