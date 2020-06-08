import { computed, observable } from 'mobx';
import User from '../models/User';
import Message from '../models/Message';
import UserStore from './UserStore';

class RoomStore {
    get stars(): Message[] {
        return this._stars;
    }
    get users(): User[] {
        return this._users;
    }
    get messages(): Message[] {
        return this._messages;
    }
    get description(): string {
        return this._description;
    }
    get name(): string {
        return this._name;
    }
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
    /*
        Given: [ { userId: 1... }, { userId: 2... }, { userId: 2... }, { userId: 1... } ]
        Return: [ [ { userId: 1... } ], [ { userId: 2... }, { userId: 2... } ], [ { userID: 1... } ] ]
     */
    @computed get groupedMessages(): Message[][] {
        const groupArray: Message[][] = [];
        for (const message of this._messages) {
            const lastItem = groupArray[groupArray.length - 1];
            if (message.user.id === lastItem?.[0]?.user.id) {
                lastItem.push(message);
            } else {
                groupArray.push([message]);
            }
        }
        return groupArray;
    }

    @observable private _id: number = 0;
    @observable private _name: string = '';
    @observable private _description: string = '';
    @observable private _users: User[] = []; // list of users currently in the room
    @observable private _messages: Message[] = [];
    @observable private _stars: Message[] = [];

    addUser(user: User) {
        UserStore.addUser(user); // add them to the user store
        this._users.push(user);
    }

    clearUsers() {
        this._users = [];
    }

    clearMessages() {
        this._messages = [];
    }

    clearStars() {
        this._stars = [];
    }

    removeUser(userId: number) {
        this._users = this._users.filter((user) => user.id !== userId);
    }

    addMessage(...messages: Message[]) {
        this._messages.push(...messages);
    }

    addStar(...messages: Message[]) {
        this._stars.push(...messages);
    }

    getUserById(userId: number) {
        return this._users.find((user: User) => user.id === userId);
    }

    getUserByMentionString(mentionString: string) {
        return this._users.find((user) => user.name.replace(/\s/, '') === mentionString);
    }
}

export default new RoomStore();
