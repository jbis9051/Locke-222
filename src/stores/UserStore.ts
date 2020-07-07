import { observable } from 'mobx';
import User from '../models/User';
import IO from '../controllers/IO';

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

    filterByMentionString(mentionString: string): User[] {
        let mentionStringSanitized = mentionString.toLowerCase();
        if (mentionStringSanitized[0] === '@') {
            mentionStringSanitized = mentionString.substring(1);
        }
        return this.users.slice(2).filter(
            (user) => user.mentionString.toLowerCase().startsWith(mentionStringSanitized) // we need to sort
        );
    }

    getByMentionString(mentionString: string) {
        let mentionStringSanitized = mentionString.toLowerCase();
        if (mentionStringSanitized[0] === '@') {
            mentionStringSanitized = mentionStringSanitized.substring(1);
        }
        return this.users
            .slice(2)
            .filter((users) => users.mentionString.toLowerCase() === mentionStringSanitized);
    }
}

export default new UserStore();
