import { observable } from 'mobx';
import User from '../models/User';
import { RoomObject } from '../interfaces/RoomObject';

class CurrentUserStore {
    get recentRooms(): RoomObject[] {
        return this._recentRooms;
    }
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
    @observable private _recentRooms: RoomObject[] = []; // 0 is most recent room, max length = 3, **does not include any favorite rooms**
    @observable private fkey: string = '';

    setFavoriteRooms(rooms: RoomObject[]) {
        this._favoriteRooms = rooms;
    }

    addToRecent(room: RoomObject) {
        if (this.favoriteRooms.some((roomObj) => roomObj.id === room.id)) {
            return;
        }
        this._recentRooms = [
            room,
            ...this._recentRooms.filter((recentRoom) => recentRoom.id !== room.id),
        ].slice(0, 3);
    }
}

export default new CurrentUserStore();
