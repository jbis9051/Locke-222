import { observable } from 'mobx';
import User from '../models/User';
import IO from '../controllers/IO';

class UserStore {
    @observable private users: User[] = []; // users cache

    addUser(user: User) {
        if (this.users.find((user: User) => user.id === user.id)) {
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
}

export default new UserStore();
