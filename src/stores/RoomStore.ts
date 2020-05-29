import {observable} from "mobx";
import User from "../models/User";
import Message from "../models/Message";

class RoomStore {
    @observable private id: number = 0;
    @observable private name: string = "";
    @observable private description: string = "";
    @observable private users: User[] = [];
    @observable private messages: Message[] = [];

    addUser(user: User){
        console.log("Adding user");
        this.users.push(user);
    }
}

export default new RoomStore();
