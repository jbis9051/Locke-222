import {UserObject} from "./UserObject";


export interface RoomInfoResponse {
    id: number,
    name: string,
    description: string,
    isFavorite: boolean,
    usage: null,
    tags: string,
}


interface UserInfoObject  extends UserObject {
    "last_post": number,
    "last_seen":number
}

export interface UserInfoResponse {
    users: UserInfoObject[]
}
