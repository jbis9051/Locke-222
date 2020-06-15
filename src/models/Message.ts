import React from 'react';
import { observable } from 'mobx';
import fromUnixTime from 'date-fns/fromUnixTime';
import User from './User';
import RoomStore from '../stores/RoomStore';
import { htmlToClassicMarkdown } from '../helpers/markdownHelper';
import { MessageEvent } from '../interfaces/WebSocketEvent';
import UserStore from '../stores/UserStore';
import { Onebox } from './onebox/Onebox';
import getOneBox from './onebox';

interface Mention {
    username: string;
    id: number | null;
}

export enum MessageType {
    MARKDOWN,
    ONEBOX,
}

class Message {
    readonly id: number;

    readonly user: User;

    @observable private _content = ''; // parsed content

    private rawContent: string; // raw content

    readonly dateCreated: Date;

    @observable private _dateModified: Date;

    @observable private mentions: Mention[] = [];

    @observable private parentId: number | null = null; // is a direct reply?

    @observable private readonly showParent: boolean = false; // is a reply?

    @observable private isStaredByMe = false;

    @observable private stars = 0;

    @observable private type: MessageType = MessageType.MARKDOWN;

    @observable private onebox?: Onebox | string;

    get isHardReply(): boolean {
        return this.showParent;
    }

    get isMention(): boolean {
        return this.mentions.length > 0;
    }

    get content(): string | React.ReactElement {
        if (this.type === MessageType.MARKDOWN) {
            return this._content;
        }
        if (typeof this.onebox === 'string') {
            return this.onebox;
        }
        return this.onebox!.jsx;
    }

    get dateModified(): Date {
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

    edit(updatedContent: string): void {
        this._dateModified = new Date();
        this.rawContent = updatedContent;
        this.parseContent();
    }

    private parseContent() {
        const content = htmlToClassicMarkdown(this.rawContent);
        if (!content) {
            this.type = MessageType.ONEBOX;
            getOneBox(this.rawContent)
                .then((onebox) => {
                    this.onebox = onebox;
                })
                .catch(console.error);
            return;
        }
        this._content = content;
        const matches = this._content.match(/@([^\s]+)/g) || [];
        matches.forEach((mention) => {
            const user = RoomStore.getUserByMentionString(mention);
            if (user) {
                this.mentions.push({ username: mention, id: user.id });
            } else {
                this.mentions.push({ username: mention, id: null });
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
