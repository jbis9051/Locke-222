export interface UserObject { // this is an object we get from them
    complete: boolean,
    email_hash: string, // contains a URL prefixed with a '!' or a hash. If it's a hash then the user doesn't have a profile pic and this should be null. We should display their initials. If it's a gif, we need a solution.
    id: number,
    is_owner: boolean,
    is_present: boolean,
    last_post: number,
    last_seen: number,
    name: string,
    reputation: number,
    status: undefined
}
