// token.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Normally using the open-source library jsonwebtoken would be more appropriate here. This code is
// left in place just to remind us that the base-64 encoding used by JWT does not follow the normal
// base-64 encoding: + became -, / became _ and that needs to be undone, and there is some funny
// Unicode translation going on.
//

import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

import { idpConnection, tokenPermissionsClaim } from 'main/config';

let keys = null;

const findKey = async (kid) => {

    let key;

    // Two passes to try to get the key; either get the initial array of keys or re-get it
    // if the key wasn't found.

    for (let i = 0; i < 2; i++) {

        if (keys ) {

            for (key of keys.keys) {

                if (key.kid === kid) {

                    break;
                }
            }
        }

        if (i == 0 && !key) {

            keys = await idpConnection.publicKeys();
        }
    }

    return key;
}

const validate = async (authorization, audience, scope) => {

    // Strip out the token if we are given a request authorization header.

    const [match, type, token] = authorization.match(/(Bearer\s+)?(.+)$/);

    // Get the token payload.

    const { header, payload } = jwt.decode(token, { complete: true });
    const key = await findKey(header.kid);
    let result = jwt.verify( token, jwkToPem(key), { algorithms: [ key.alg ], audience: audience });

    if (result && scope) {

        // Make sure we have the requested scope(s).

        let requestedScopes = Array.isArray(scope) ? scope : [ scope ];

        for (let scope of requestedScopes) {

            // Permissions are not a registered claim in RFC7519, so the name is set in the config

            if (!payload[tokenPermissionsClaim].includes(scope)) {

                result = false;
                break;
            }
        }
    }

    return result;
}

export { validate };