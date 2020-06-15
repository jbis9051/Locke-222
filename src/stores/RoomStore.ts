import { computed, observable } from 'mobx';
import differenceInHours from 'date-fns/differenceInHours';
import User from '../models/User';
import Message from '../models/Message';
import UserStore from './UserStore';
import { PingableUserObject } from '../interfaces/PingableUserObject';
import { htmlToClassicMarkdown } from '../helpers/markdownHelper';

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
        return htmlToClassicMarkdown(this._description)!;
    }

    set description(value: string) {
        this._description = value;
    }

    /*
        Given: [ { userId: 1... }, { userId: 2... }, { userId: 2... }, { userId: 1... } ]
        Return: [ [ { userId: 1... } ], [ { userId: 2... }, { userId: 2... } ], [ { userID: 1... } ] ]
     */
    @computed get groupedMessages(): Message[][] {
        const groupArray: Message[][] = [];
        for (const message of this._messages) {
            const lastArray = groupArray[groupArray.length - 1];
            const lastItem = lastArray?.[lastArray?.length - 1];
            if (
                message.user.id === lastItem?.user.id &&
                differenceInHours(message.dateCreated, lastItem?.dateCreated) < 1
            ) {
                lastArray.push(message);
            } else {
                groupArray.push([message]);
            }
        }
        return groupArray;
    }

    @observable id = 0;

    @observable name = '';

    @observable private _description = '';

    @observable private _users: User[] = []; // list of users currently in the room

    @observable private _messages: Message[] = [];

    @observable private _stars: Message[] = [];

    @observable pingable: PingableUserObject[] = [];

    @observable isFavorite = false;

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
