import { UserObject } from './UserObject';

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
