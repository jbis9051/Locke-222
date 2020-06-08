import { observable } from 'mobx';
import fromUnixTime from 'date-fns/fromUnixTime';
import User from './User';
import RoomStore from '../stores/RoomStore';
import { htmlToClassicMarkdown } from '../helpers/markdownHelper';
import { MessageEvent } from '../interfaces/WebSocketEvent';
import UserStore from '../stores/UserStore';

interface Mention {
    username: string;
    id: number | null;
}

class Message {
    readonly id: number;
    readonly user: User;
    @observable private _content: string = ''; // parsed content
    private rawContent: string; // raw content
    readonly dateCreated: Date;
    @observable private _dateModified: Date;
    @observable private mentions: Mention[] = [];
    @observable private parentId: number | null = null; // is a direct reply?
    @observable private showParent: boolean = false; // is a reply?
    @observable private isStaredByMe: boolean = false;
    @observable private stars: number = 0;

    get isHardReply() {
        return this.showParent;
    }

    get isMention() {
        return this.mentions.length > 0;
    }

    get content() {
        return this._content;
    }

    get dateModified() {
        return this._dateModified;
    }

    constructor(
        id: number,
        user: User,
        content: string,
        dateCreated: Date,
        isStaredByMe: boolean,
        stars: number,
        parentId?: number,
        showParent?: boolean
    ) {
        this.id = id;
        this.user = user;
        this.rawContent = content;
        this.dateCreated = dateCreated;
        this._dateModified = this.dateCreated;
        if (parentId) {
            this.parentId = parentId;
        }
        if (showParent) {
            this.showParent = showParent;
        }
        this.parseContent();
    }

    edit(updatedContent: string) {
        this._dateModified = new Date();
        this.rawContent = updatedContent;
        this.parseContent();
    }

    private parseContent() {
        this._content = htmlToClassicMarkdown(this.rawContent);
        const matches = Array.from(this._content.matchAll(/@([^\s]+)/g));
        matches.forEach((mention) => {
            const user = RoomStore.getUserByMentionString(mention[1]);
            if (user) {
                this.mentions.push({ username: mention[1], id: user.id });
            } else {
                this.mentions.push({ username: mention[1], id: null });
            }
        });
    }

    static async fromEvent(event: MessageEvent): Promise<Message> {
        const user = await UserStore.getUserById(event.user_id);
        return new Message(
            event.message_id,
            user,
            event.content,
            fromUnixTime(event.time_stamp),
            !!event.message_stared,
            event.message_stars || 0,
            event.parent_id,
            event.show_parent
        );
    }
}

export default Message;
