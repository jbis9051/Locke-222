import {computed, observable} from "mobx";
import User from "./User";
import RoomStore from "../stores/RoomStore";

interface Mention {
    username: string,
    id: number | null
}

class Message {
    @observable private id: number;
    @observable private user: User;
    @observable private content: string = ""; // parsed content, strip SO tags and add our own
    @observable private rawContent: string; // raw content
    @observable private dateReceived: Date;
    @observable private mentions: Mention[] = [];
    @observable private parentId: number | null = null;
    @observable private showParent: boolean = false;

    get isHardReply(){
        return this.showParent;
    }

    get isMention(){
        return this.mentions.length > 0;
    }

    constructor(id: number, user: User, content: string, parentId?: number, showParent?: boolean) {
        this.id = id;
        this.user = user;
        this.rawContent = content;
        this.dateReceived = new Date();
        if(parentId){
            this.parentId = parentId;
        }
        if(showParent) {
            this.showParent = showParent;
        }
        this.parseContent();
    }

    edit(updatedContent: string){
        this.rawContent = updatedContent;
        this.parseContent();
    }

    parseContent(){
        this.content = this.rawContent; // TODO strip tags and stuffs
        const matches = Array.from(this.content.matchAll(/@([^\s]+)/));
        matches.forEach(mention => {
           const user =  RoomStore.getUserByMentionString(mention[1]);
           if(user){
               this.mentions.push({username: mention[1], id: user.id})
           } else {
               this.mentions.push({username: mention[1], id: null})
           }
        });
    }

}
export default Message;
