// IdpConnection.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This class implements the template-method design pattern: the _keyPath method is implemented in the
// sub-class to define the URL to get the keys, while the bulk of the work remains in this class.
//

import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { apiAudience } from '../config/config.mjs';

class IdpConnection {

    constructor() {

        this._keys = null;
    }

    async _findKey(kid) {

        let key;

        // Two passes to try to get the key; either get the initial array of keys or re-get it
        // if the key wasn't found.

        for (let i = 0; i < 2; i++) {

            if (this._keys ) {

                for (key of this._keys.keys) {

                    if (key.kid === kid) {

                        break;
                    }
                }
            }

            if (i == 0 && (!this._keys || !key)) {

                // Go back to Auth0 to get the keys.

                let response = await fetch(this._keyPath());
                this._keys = await response.json(response);
            }
        }

        return key;
    }

    _keyPath() {

        // This method is overridden in the sub-class to provide the correct URL for the sub-class IdP.
    }

    async validate(authorization, scope) {

        // We expect the bearer token from the HTTP header.

        const [ match, type, token ] = authorization.match(/(Bearer)\s+(.+)$/);

        // Get the token payload.

        const { header, payload } = jwt.decode(token, { complete: true });
        const key = await this._findKey(header.kid);
        let result = jwt.verify( token, jwkToPem(key), { algorithms: [ key.alg ], audience: apiAudience });

        if (result) {

            // Make sure we have the requested scope(s).

            let requestedScopes = Array.isArray(scope) ? scope : [ scope ];

            for (let scope of requestedScopes) {

                if (!payload.scp.includes(scope)) {

                    result = false;
                    break;
                }
            }
        }

        return result;
    }
}

export default IdpConnection;