// Auth0Adapter.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Authentication and authorization adapter for Auth0.
//

import { authorizationCallback, clientId, idpDomain, logoutCallback } from '../config/config.mjs';
import { nonce, challenge } from './crypto.mjs';
import IdpConnection from './IdpConnection.mjs';

class Auth0Adapter extends IdpConnection {

    _implicitFlowUri(state) {

        return `${idpDomain}/authorize?response_type=id_token%20token&response_mode=fragment&client_id=${clientId}&redirect_uri=${encodeURIComponent(authorizationCallback)}&scope=openid%20email%20profile%20offline_access&nonce=${nonce}&state=${state}&audience=http://localhost:8000`;
    }

    _authCodeFlowWithPkceUri(state) {
        
        return `${idpDomain}/authorize?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=${clientId}&redirect_uri=${encodeURIComponent(authorizationCallback)}&scope=openid%20email%20profile%20offline_access&state=${state}&audience=http://localhost:8000`;
    }

    _logoutUri(idToken) {

        return `${idpDomain}/logout?client_id=${clientId}&return_to=${logoutCallback}`;
    }

    _requestTokensUri() {

        return `${idpDomain}/oauth/token`;
    }
}

export default Auth0Adapter;