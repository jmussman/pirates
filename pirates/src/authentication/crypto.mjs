// crypto.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';

// Definitions

const pkceName = 'pkce.verifier';

// The nonce is required for the OIDC implicit flow (deprecated so it isn't actually used). The point of the nonce is that
// the application callback happens with the same nonce we sent, so if we don't see the same nonce then we didn't ask for it!

const nonce = cryptoRandomString({length: 10, type: 'url-safe'});

// The verifier are used with the OIDC authorization code with pkce flow. This is a bit tricky:
// if the verifier is found in local storage this is a reload after authentication so clear
// local storage t0 create a new random verifier on the next page load.

const base64URLEncode = (str) => {

    // This handles the "different" base-64 encoding used by JWTs.

    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

let verifier = localStorage.getItem(pkceName);

if (verifier) {

    // If the verifier was in local storage we are on the callback from the IdP, so remove the
    // verifier to prevent confusion on the next call to the application.

    localStorage.removeItem(pkceName);

} else {

    verifier = base64URLEncode(crypto.randomBytes(32));
}

const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());

const setPkceVerifier = (verifier) => {

    // Used by the authentication mechanism to remember the PKCE when the callback occurs.

    localStorage.setItem(pkceName, verifier);
}

export { nonce, verifier, challenge, setPkceVerifier };