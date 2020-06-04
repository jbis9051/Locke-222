import { observable } from 'mobx';
import User from '../models/User';
import Message from '../models/Message';

class CurrentUserStore {
    @observable private user: User | null = null;
    @observable private fkey: string = '';
}

export default new CurrentUserStore();
