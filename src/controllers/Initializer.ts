// This is used to initialize the stores when the room changes. Often we get
// this data from various AJAX requests. The exception is the initial page load.
// Instead, we take most data directly from the page.

import {PageJSData} from "../interfaces/PageJSData";
import User from "../models/User";
import RoomStore from "../stores/RoomStore";

export default function Initializer(data: PageJSData) {

    // RoomStore Setup
    data.users
        .map(userObject => User.fromUserObject(userObject))
        .forEach(user => RoomStore.addUser(user));
}
