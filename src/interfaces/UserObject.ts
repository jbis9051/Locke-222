export interface UserObject { // this is an object we get from the page
    id: number,
    name: string,
    email_hash: string, // contains a URL prefixed with a '!' or a hash. If it's a hash then the user doesn't have a profile pic. If it's a gif, we need a solution.
    reputation: number,
    last_post: number,

    is_owner?: true,
    is_moderator?: true,
}
