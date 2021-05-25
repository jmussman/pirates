// IdpConnection.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// The IdpConnection is a class because there are four associated methods and we need polymorphism to
// kick in when the concrete implementations are passed into the application via config. This class
// implements the template-method design pattern: the _keyPath method is implemented in the
// sub-class to define the URL to get the keys, while the bulk of the work remains in this class.
//

import $ from 'jquery';

import { authorizationCallback, clientId, leadTimeToRefresh } from '../config/config.mjs';
import { verifier, setPkceVerifier } from './crypto.mjs';
import { getPayload } from './token.mjs';

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

    async authorize(params) {

        // This method could succeed or error; in either case what happens is on the presentation side so not responsibility
        // of this code to handle. A promise is returned for the client code to decide what to do.

        // This method works from the URL query data that is passed in as "params".

        let result = null;
        let authorizationCode = params.get('code');
    
        // If the parameters has an 'error' that originated from the IdP.

        if (params.get('error')) {

            throw new Error(`Authentication error: ${params.get('error_description')}`);
    
        } else if (authorizationCode) {

            result = await this._requestTokens(authorizationCode)
        }

        return result;
    }

    authenticate(state) {

        // This method invokes the IdP to authenticate the user and passes the state through. The method should cause the
        // SPA to be unloaded; if that does not happen the request to the IdP was not possible (network error, etc.).

        // Persist the verifier across the callback.

        setPkceVerifier(verifier);

        // Trigger the browser to go to the IdP.
        
        location.href = this._authCodeFlowWithPkceUri(state);
    }

    getTokens() {

        // This method returns an array of the two tokens after authentication: [ idToken, accessToken ].

        return [ this._idToken, this._accessToken, this._refreshToken ];
    }

    _implicitFlowUri() {

        // This method is overridden in the sub-class to provide the correct URL to initiate authorization code flow. This
        // flow should never be used, it is deprecated for security reasons.
    }

    invalidateTokensAndLogout() {

        // Invalidate tokens should be called when the user logs out of the application.

        if (this._timer) {

            clearTimeout(this._timer);
        }

        let idToken = this._idToken;

        this._idToken = null;
        this._accessToken = null;
        this._refreshToken = null;

        // This should cause the page to unload, the 

        location.href = this._logoutUri(idToken);
    }

    _logoutUri() {

        // This method is overridden in the sub-class to provide the correct URL to initiate a logout at the IdP..
    }

    async _requestTokens(authorizationCode) {

        let result = true;

        if (authorizationCode || this.idToken) {

            // This "private" method is used to handle the request for tokens from the IdP. If the authorization code is not
            // provided the refresh_token will be used.
            
            // Setup the request data for the POST AJAX call.

            let reqData = {
                client_id: clientId,
            }

            if (authorizationCode) {

                reqData.grant_type = 'authorization_code';
                reqData.code_verifier = verifier,
                reqData.code = authorizationCode;
                reqData.redirect_uri = encodeURI(authorizationCallback);

            } else {

                reqData.grant_type = 'refresh_token';
                refresh_token = this._refreshToken;
            }

            try {
                    
                let res = await $.ajax({ type: 'POST', url: this._requestTokensUri(), contentType: 'application/x-www-form-urlencoded; charset=utf-8', dataType: 'json', data: reqData, crossDomain: true, cache: true })

                // NOTE: NO VALIDATION OF THE TOKENS IS NECESSARY BECAUSE WE JUST ASKED THE IdP FOR THEM!
                // When an API is presented the bearer token (accessToken) by this application then it should be validated.

                this._idToken = res.id_token;
                this._accessToken = res.access_token;
                this._refreshToken = res.refresh_token;

                // Schedule a refresh for the tokens.

                if (this._refreshToken) {

                    // Only if there is a refresh token. Assume rotating refresh tokens because this is a SPA.

                    let accessTokenPayload = getPayload(this._accessToken);
                    let limit = (accessTokenPayload.exp * 1000) - (new Date().getTime()) - leadTimeToRefresh;  // Expiration - lead times.

                    console.log(`refresh in ${limit} milliseconds`);
                    this._timer = setTimeout(limit, this._requestTokens.bind(this));
                }
            }

            catch (err) {

                let description = (err && err.responseJSON) ? err.responseJSON.error_description : err.message;

                this._idToken = this.accessToken = this._refreshToken = null;
                throw new Error(`token failure: ${description}`);
            }

            return result;
        }
    }

    _requestTokensUri() {

        // This method is overridden in the sub-class to provide the correct URL to initiate a tokens request.
    }

}

export default IdpConnection;