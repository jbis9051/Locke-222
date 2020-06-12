import { UserObject } from './UserObject';
import { MessageEvent } from './WebSocketEvent';

export interface RoomInfoResponse {
    id: number;
    name: string;
    description: string;
    isFavorite: boolean;
    usage: null;
    tags: string;
}

interface UserInfoObject extends UserObject {
    last_post: number;
    last_seen: number;
}

export interface UserInfoResponse {
    users: UserInfoObject[];
}

export interface ThumbsResponse {
    id: number;
    name: string;
    email_hash: string;
    last_seen: number;
    last_post: number;
    rooms: {
        id: number;
        name: string;
        last_post: number;
        activity: number;
    }[];
    usage: null;
    user_message: string | null;
    is_moderator: null;
    reputation: number;
    profileUrl: string;
    site: {
        icon: string;
        caption: string;
    };
    invite_targets: null;
    host: string;
    may_pairoff: boolean;
}

export interface EventsResponse {
    events: MessageEvent[];
    ms: number;
    sync: number;
    time: number;
}

export type PingableResponse = [number, string, number, number][]; // [id, name, last seen, last message] I'm not sure the order of last seen and last message but they are in unix time
