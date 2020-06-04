export enum EventType { // https://github.com/jbis9051/JamesSOBot/blob/master/docs/CHAT_API.md#events-we-care-about
    NEW_MESSAGE = 1,
    EDIT,
    USER_JOIN,
    USER_LEAVE,
    ROOM_INFO_CHANGE,
    STAR_MESSAGE,
    DEBUG_MESSAGE,
    MENTION_MESSAGE,
    MESSAGE_FLAGGED,
    MESSAGE_DELETED,
    FILE_ADDED,
    MESSAGE_FLAGGED_MODERATOR,
    USER_IGNORED,
    GLOBAL_NOTIFICATION,
    USER_ACCESS_CHANGE,
    USER_NOTIFICATION,
    ROOM_INVITE,
    REPLY_MESSAGE,
    MESSAGE_MOVED_OUT,
    MESSAGED_MOVED_IN,
    TIME_BREAK,
    TICKER_ADD,
    USER_SUSPENDED = 29,
    USER_MERGE,
    USER_INFO_CHANGED = 34,
}

export interface TikTokEvent {
    t: number;
    d: number;
}

export interface MessageEvent {
    event_type: EventType.NEW_MESSAGE;
    time_stamp: number;
    content: string;
    id: number;
    user_id: number;
    user_name: string;
    room_id: number;
    room_name: string;
    message_id: number;
}

export interface UserJoinEvent {
    event_type: EventType.USER_JOIN;
    time_stamp: number;
    id: number;
    user_id: number;
    target_user_id: number;
    user_name: string;
    room_id: number;
    room_name: string;
}

export interface WebSocketEvent {
    [key: string]: RoomEvent | TikTokEvent;
}

export interface RoomEvent {
    e: Array<MessageEvent | UserJoinEvent>;
    t: number;
    d: number;
}
