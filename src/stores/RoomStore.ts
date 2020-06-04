import { observable } from 'mobx';
import User from '../models/User';
import Message from '../models/Message';
import UserStore from './UserStore';

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
    @observable private _name: string = '';
    @observable private _description: string = '';
    @observable private users: User[] = []; // list of users currently in the room
    @observable private messages: Message[] = [];

    addUser(user: User) {
        UserStore.addUser(user); // add them to the user store
        this.users.push(user);
    }

    removeUser(userId: number) {
        this.users = this.users.filter((user) => user.id !== userId);
    }

    addMessage(message: Message) {
        this.messages.push(message);
    }

    getUserById(userId: number) {
        return this.users.find((user: User) => user.id === userId);
    }

    getUserByMentionString(mentionString: string) {
        return this.users.find((user) => user.name.replace(/\s/, '') === mentionString);
    }
}

export default new RoomStore();
