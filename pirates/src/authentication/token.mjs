// token.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Normally using the open-source library jsonwebtoken would be more appropriate here. This code is
// left in place just to remind us that the base-64 encoding used by JWT does not follow the normal
// base-64 encoding: + became -, / became _ and that needs to be undone, and there is some funny
// Unicode translation going on.
//

const getPayload = (token) => {

    let [ header, payload, signature ] = token.split('.');
    
    // Put back the character conversions defined by JWS.

    payload = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Deal with Unicode after decoding the base-64 payload.

    payload = decodeURIComponent(atob(payload).split('').map((c) => {

        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);

    }).join(''));

    return JSON.parse(payload);
}

export { getPayload };