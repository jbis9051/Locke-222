import { observable } from 'mobx';
import User from '../models/User';
import Message from '../models/Message';
import { RoomObject } from '../interfaces/RoomObject';

class CurrentUserStore {
    get favoriteRooms(): RoomObject[] {
        return this._favoriteRooms;
    }
    @observable private user: User | null = null;
    @observable private _favoriteRooms: RoomObject[] = []
    @observable private fkey: string = '';

    setFavoriteRooms(rooms: RoomObject[]){
        this._favoriteRooms = rooms;
    }
}

export default new CurrentUserStore();
