// config.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

const idpDomain = '';
const clientId = '';

// Declarations of endpoints and state in this application.
//

const apiAudience = 'http://localhost:8000';                            // The audience for the access token (matches IdP configuration).
const apiUri = 'http://localhost:8000';                                    // Address of API.
const authorizationCallback = 'http://localhost:9000/authorize';        // The callback after authentication in this app.
const leadTimeToRefresh = 600000;                                       // Refresh the access token when time is within this many milliseconds.
const logoutCallback = 'http://localhost:9000';                         // The landing page after logout in this app.

// The IdpConnection that will be used for this application.
//

const idpConnection = null;

// import OktaAdapter from '../authentication/OktaAdapter.mjs';
// idpConnection = new OktaAdapter();

// import Auth0Adapter from '../authentication/Auth0Adapter.mjs';
// idpConnection = new Auth0Adapter();

export { apiAudience, apiUri, authorizationCallback, clientId, idpConnection, idpDomain, leadTimeToRefresh, logoutCallback };