import {observable} from "mobx";
import User from "../models/User";
import Message from "../models/Message";

class RoomStore {
    set id(value: number) {
        this._id = value;
    }
    set description(value: string) {
        this._description = value;
    }
    set name(value: string) {
        this._name = value;
    }
    get id(): number {
        return this._id;
    }

    @observable private _id: number = 0;
    @observable private _name: string = "";
    @observable private _description: string = "";
    @observable private users: User[] = [];
    @observable private messages: Message[] = [];

    addUser(user: User){
        this.users.push(user);
    }

    addMessage(message: Message){
        this.messages.push(message);
    }

    getUserById(userId: number){
        return this.users.find((user: User) => user.id === userId);
    }

    getUserByMentionString(mentionString: string){
        return this.users.find(user => user.name.replace(/\s/, '') === mentionString)
    }
}

export default new RoomStore();
