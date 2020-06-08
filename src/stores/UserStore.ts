import { observable } from 'mobx';
import User from '../models/User';
import IO from '../controllers/IO';
import { isNullOrUndefined } from 'util';

class UserStore {
    @observable private users: User[] = []; // users cache

    addUser(user: User) {
        if (this.users.find((aUser: User) => aUser.id === user.id)) {
            return;
        }
        this.users.push(user);
    }

    async getUserById(userId: number): Promise<User> {
        const cached = this.users.find((user: User) => user.id === userId);
        if (cached) {
            return cached;
        }
        const info = await IO.getUserInfo(userId);
        const user = User.fromUserObject(info);
        this.addUser(user);
        return user;
    }

    getUserByMentionString(mentionString: string) {
        return this.users.find((user) => user.name.replace(/\s/, '') === mentionString);
    }

    clearStore() {
        this.users = [];
    }
}

export default new UserStore();