import {observable} from "mobx";
import {UserObject} from "../interfaces/UserObject";

class User {
    @observable private id: number;
    @observable private name: string;
    @observable private imageURL: string | null;
    @observable private is_moderator: boolean;
    @observable private is_owner: boolean;
    @observable private last_post: number;
    @observable private last_seen: Date;

    constructor(id: number, name: string, imageURL: string | null, is_moderator: boolean, is_owner: boolean, last_post: number, last_seen: Date) {
        this.id = id;
        this.name = name;
        this.imageURL = imageURL;
        this.is_moderator = is_moderator;
        this.is_owner = is_owner;
        this.last_post = last_post;
        this.last_seen = last_seen;
    }

    static fromUserObject(userObject: UserObject): User {
        // TODO
        return {} as User;
    }

}
export default User;
