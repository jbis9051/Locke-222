import {observable} from "mobx";
import {UserObject} from "../interfaces/UserObject";

class User {
    get name(): string {
        return this._name;
    }
    get id(): number {
        return this._id;
    }

    @observable private _id: number;
    @observable private _name: string;
    @observable private image_url: string | null;
    @observable private is_moderator: boolean;
    @observable private is_owner: boolean;

    constructor(id: number, name: string, image_url: string | null, is_moderator: boolean, is_owner: boolean) {
        this._id = id;
        this._name = name;
        this.image_url = image_url;
        this.is_moderator = is_moderator;
        this.is_owner = is_owner;
    }

    static fromUserObject(userObject: UserObject): User {
        let imageURL = userObject.email_hash;
        if(imageURL.startsWith('!')){
            imageURL = imageURL.substring(1);
        } else {
            imageURL = `https://www.gravatar.com/avatar/${imageURL}?d=identicon&r=PG`;
        }
        return new User(userObject.id, userObject.name, imageURL, !!userObject.is_moderator, !!userObject.is_owner)
    }
}
export default User;
