// IdpConnection.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// The IdpConnection is a class because there are four associated methods and we need polymorphism to
// kick in when the concrete implementations are passed into the application via config. This class
// implements the template-method design pattern: the _keyPath method is implemented in the
// sub-class to define the URL to get the keys, while the bulk of the work remains in this class.
//

import $ from 'jquery';

import { clientId, apiAudience, leadTimeToRefresh } from 'main/config';
import setVerifier from 'authentication/pkce';
import { getPayload, validate } from 'authentication/token';

class IdpConnection {

    constructor() {

        this._accessToken = null;
        this._idToken = null;
        this._refreshToken = null;
        this._timer = null;
    }

    _authCodeFlowWithPkceUri() {

        // This method is overridden in the sub-class to provide the correct URL to initiate authorization code flow.
    }

    async authenticate(state) {

        // This method invokes the IdP to authenticate the user and passes the state through. The method should cause the
        // SPA to be unloaded; if that does not happen the request to the IdP was not possible (network error, etc.).
        
        if (!this._idToken) {

            setVerifier();
            location.href = this._authCodeFlowWithPkceUri(state);

            // Delay execution to give the location change a moment to kick in before we fall through into whatever
            // code may come after this. What follows this method should never execute.
            //
            // This sleep function declaration should really be global to the module so it is not recreated every time
            // authenticate is called, but it has been placed here as an example to understand the flow.

            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

            await sleep(2000);
        }
    }

    async authorize() {

        // The authorization code and state ride in the response query string.

        const params = (new URL(document.location)).searchParams;

        if (params.get('error')) {
    
            // An 'error' that originated from the IdP.

            throw new Error(`Authentication error: ${params.get('error_description')}`);
    
        } else {

            await this._requestTokens(params.get('code'));

            return params.get('state');
        }
    }

    getTokens() {

        // This method returns an array of the two tokens after authentication: [ idToken, accessToken ].

        return [ this._idToken, this._accessToken, this._refreshToken ];
    }

    invalidateTokensAndSignout() {

        // Invalidate tokens should be called when the user logs out of the application.

        if (this._timer) {

            clearTimeout(this._timer);
        }

        let idToken = this._idToken;

        this._idToken = null;
        this._accessToken = null;
        this._refreshToken = null;

        // This should cause the page to unload, the 

        location.href = this._signoutUri(idToken);
    }

    async publicKeys() {

        // This method is overridden in the sub-class to return the URL to retrieve the public keys.
    }

    async _requestTokens(authorizationCode) {

        // If this method is called without an authorization code then it is a token refresh.

        try {

            let res = await $.ajax(this._requestTokensAjaxConfig(authorizationCode));

            this._idToken = res.id_token;
            this._accessToken = res.access_token;
            this._refreshToken = res.refresh_token;

            // Validate the key.

            if (!await validate(this._idToken, clientId)) {

                throw new Error('invalid ID Token');
            }
            
            if (this._accessToken && !await validate(this._accessToken, apiAudience, [ 'read:ships', 'read:treasure' ])) {

                throw new Error('invalid access token');
            }                

            if (this._refreshToken) {

                // Schedule a refresh if there is a refresh token; assume rotating refresh tokens because this is a SPA.
                // Use the minimum expiration time of the id and access tokens; it would be really nice to add the
                // refresh token too but the OAuth standard does not provide a way to determine it and it is configurable
                // by the IdP administrator.

                let accessTokenPayload = getPayload(this._accessToken);
                let idTokenPayload = getPayload(this._idToken);
                let tokenExpiresIn = (Math.min(accessTokenPayload.exp, idTokenPayload.exp) * 1000) - (new Date().getTime());
                let refreshIn = tokenExpiresIn - leadTimeToRefresh;

                if (refreshIn < 0) {

                    // The leadTimeToRefresh is greater than the token; split the token time in half.

                    refreshIn = tokenExpiresIn / 2;
                }

                this._timer = setTimeout(this._requestTokens.bind(this), refreshIn);
            }
        }

        catch (err) {

            let description = (err && err.responseJSON) ? err.responseJSON.error_description : err.message;

            this._idToken = this.accessToken = this._refreshToken = null;
            throw new Error(`token failure: ${description}`);
        }
    }

    _requestTokensAjaxConfig() {

        // This method is overridden in the sub-class to provide the correct config for the AJAX request above.
    }

    _signoutUri() {

        // This method is overridden in the sub-class to provide the correct URL to initiate a logout at the IdP..
    }
}

export default IdpConnection;