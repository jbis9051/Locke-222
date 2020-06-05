import { observable } from 'mobx';
import User from '../models/User';
import { RoomObject } from '../interfaces/RoomObject';

class CurrentUserStore {
    set user(value: User | null) {
        this._user = value;
    }
    get user(): User | null {
        return this._user;
    }
    get favoriteRooms(): RoomObject[] {
        return this._favoriteRooms;
    }
    @observable private _user: User | null = null;
    @observable private _favoriteRooms: RoomObject[] = [];
    @observable private fkey: string = '';

    setFavoriteRooms(rooms: RoomObject[]) {
        this._favoriteRooms = rooms;
    }
}

export default new CurrentUserStore();
