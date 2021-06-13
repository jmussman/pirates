// pkce.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Handle the verifier and challenge and expose them to the authentication module. Since the page is
// unloaded between the authentication request and callback the verifier is saved in local storage.
// When the module initializes if the verifier is in local storage then we are on the callback side,
// otherwise we are before an authentication request so create a new verifier and put it in local storage. 

import crypto from 'crypto';

const base64URLEncode = (str) => {

    // Both the verifier and the hashed verifier need to be send to the IdP as a modified
    // base-64:  + becomes -, / becomes _, and = becomes '' (empty string so no padding).

    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const setChallenge = () => {

    // Hash the verifier with SHA256 to make the challenge and base-64 encode that.

    challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
}

const setVerifier = () => {

    // Cryptographically random verifier, base-64 encoded, and hashed challenge. The verifier has
    // to survive the SPA reload in the authentication flow, so it needs to be stored securely.
    // Local storage is persistent on disk so avoid that; cookies with a data are persistent so
    // avoid that; transient cookies are in-memory only but will still be sent to the server so mark
    // them with secure so they only get passed on TLS connections. The server will see the
    // authorization code and now have the verifier so it has to be trusted.

    verifier = base64URLEncode(crypto.randomBytes(32));
    localStorage.setItem(pkceName, verifier);
    setChallenge();
}

const pkceName = 'pkce.verifier';
let challenge;
let verifier = localStorage.getItem(pkceName);

verifier ? setChallenge() : setVerifier();

export default setVerifier;
export { challenge, verifier };