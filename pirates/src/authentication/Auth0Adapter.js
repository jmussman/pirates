// Auth0Adapter.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// Authentication and authorization adapter for Auth0.
//

import { apiAudience, authorizationRedirect, authorizationServerUri, clientId, oidcDiscovery, signoutRedirect } from 'main/config';
import IdpConnection from 'authentication/IdpConnection';
import { challenge, verifier } from 'authentication/pkce';

class Auth0Adapter extends IdpConnection {

    _authCodeFlowWithPkceUri(state) {
        
        // Return the URL with the proper query-string parameters to initiate OIDC authorization code flow with PKCE.

        return  `${oidcDiscovery.authorization_endpoint}?` +
                'response_type=code' +
                `&code_challenge=${challenge}` +
                '&code_challenge_method=S256' +
                `&client_id=${clientId}` +
                `&redirect_uri=${encodeURIComponent(authorizationRedirect)}` +
                `&scope=${encodeURIComponent('openid email profile offline_access read:ships read:treasure')}` +
                `&state=${state}` +
                `&audience=${apiAudience}`;
    }

    async publicKeys() {

        // Load and return the public keys from the IdP.

        const response = await fetch(oidcDiscovery.jwks_uri);
        
        return await response.json(response);
    }

    _requestTokensAjaxConfig(authorizationCode) {

        // Configure the AJAX request to get tokens from the IdP.

        const reqData = {
            client_id: clientId
        }

        if (authorizationCode) {

            reqData.grant_type = 'authorization_code';
            reqData.code = authorizationCode;
            reqData.code_verifier = verifier;
            reqData.redirect_uri = encodeURI(authorizationRedirect);

        } else {

            reqData.grant_type = 'refresh_token';
            reqData.refresh_token = this._refreshToken;
        }
                    
        const ajaxConfig = {

            type: 'POST',
            url: oidcDiscovery.token_endpoint,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
            data: reqData,
            crossDomain: true,
            cache: true
        }

        return ajaxConfig;
    }

    _signoutUri(idToken) {

        // Return the formatted URL to end the session with the IdP. The Auth0 endpoint does not
        // comply with the OIDC specification and does not appear in the Auth0 OIDC discovery document!

        return  `${authorizationServerUri}/logout?` +
                `client_id=${clientId}` +
                `&return_to=${encodeURIComponent(signoutRedirect)}`;
    }
}

var idpConnection = new Auth0Adapter;
export { idpConnection };