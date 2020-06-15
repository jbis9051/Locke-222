import { observable } from 'mobx';
import { UserObject } from '../interfaces/UserObject';

class User {
    get is_owner(): boolean {
        return this._is_owner;
    }

    get is_moderator(): boolean {
        return this._is_moderator;
    }

    get image_url(): string {
        return this._image_url;
    }

    get name(): string {
        if (this.is_moderator) {
            return `${this._name} ♦`;
        }
        return this._name;
    }

    get id(): number {
        return this._id;
    }

    @observable private _id: number;

    @observable private _name: string;

    @observable private _image_url: string;

    @observable private _is_moderator: boolean;

    @observable private _is_owner: boolean;

    constructor(
        id: number,
        name: string,
        image_url: string,
        is_moderator: boolean,
        is_owner: boolean
    ) {
        this._id = id;
        this._name = name;
        this._image_url = image_url;
        this._is_moderator = is_moderator;
        this._is_owner = is_owner;
    }

    static fromUserObject(userObject: UserObject): User {
        let imageURL = userObject.email_hash;
        if (imageURL.startsWith('!')) {
            imageURL = imageURL.substring(1);
        } else {
            // TODO we need to detect somehow if they have an avatar or not
            imageURL = `https://www.gravatar.com/avatar/${imageURL}`; // d=identicon&r=PG
        }
        return new User(
            userObject.id,
            userObject.name,
            imageURL,
            !!userObject.is_moderator,
            !!userObject.is_owner
        );
    }
}
export default User;
