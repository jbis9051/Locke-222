import {observable} from "mobx";
import User from "./User";

class Message {
    @observable private id: number;
    @observable private user: User;
    @observable private content: string;
    @observable private dateReceived: Date;

    constructor(id: number, user: User, content: string) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.dateReceived = new Date();
    }

    edit(updatedContent: string){
        this.content = updatedContent;
    }

}
export default Message;
