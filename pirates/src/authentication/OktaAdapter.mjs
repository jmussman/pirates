// OktaAdapter.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Authentication and authorization adapter for Auth0.
//

import { apiId, authorizationCallback, clientId, idpDomain, logoutCallback } from '../config/config.mjs';
import { nonce, challenge } from './crypto.mjs';
import IdpConnection from './IdpConnection.mjs';

class OktaAdapter extends IdpConnection {

    _implicitFlowUri(state) {

        return `${idpDomain}/authorize?response_type=id_token%20token&response_mode=fragment&client_id=${clientId}&redirect_uri=${encodeURIComponent(authorizationCallback)}&scope=openid%20email%20profile%20offline_access&nonce=${nonce}&state=${state}&audience=http://localhost:8000`;
    }

    _authCodeFlowWithPkceUri(state) {

        return `${idpDomain}/authorize?response_type=code&response_mode=fragment&code_challenge=${challenge}&code_challenge_method=S256&client_id=${clientId}&redirect_uri=${encodeURIComponent(authorizationCallback)}&scope=openid%20email%20profile%20offline_access%20read:ships%20read:treasure&state=${state}&audience=http://localhost:8000`;
    }

    _logoutUri(idToken) {

        return `${idpDomain}/logout?id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${encodeURIComponent(logoutCallback)}`;
    }

    _requestTokensUri() {

        return `${idpDomain}/token`;
    }
}

export default OktaAdapter;