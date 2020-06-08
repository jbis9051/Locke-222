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

export interface Event {
    event_type: EventType;
    time_stamp: number;
    id: number;
}

export interface MessageEvent extends Event {
    event_type: EventType.NEW_MESSAGE;
    content: string;
    user_id: number;
    user_name: string;
    room_id: number;
    room_name: string;
    message_id: number;
    parent_id?: number;
    show_parent: true;
    message_stars?: number;
    message_stared?: true; // if the current user has stared it, only appears if true
}

export interface UserJoinEvent extends Event {
    event_type: EventType.USER_JOIN;
    user_id: number;
    target_user_id: number;
    user_name: string;
    room_id: number;
    room_name: string;
}

export interface StarEvent extends Event {
    event_type: EventType.STAR_MESSAGE;
    content: string;
    user_id: number;
    user_name: string;
    room_id: number;
    room_name: string;
    message_id: number;
    message_stars: number;
    message_started: boolean; // if the current user has stared it
}

export interface WebSocketEvent {
    [key: string]: RoomEvent | TikTokEvent;
}

export interface RoomEvent {
    e: Array<Event>;
    t: number;
    d: number;
}
