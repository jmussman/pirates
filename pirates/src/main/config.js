// config.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import OktaAdapter from 'authentication/OktaAdapter';

const authorizationServerUri = 'https://dev-XXXXXXXX.okta.com/oauth2/ausXXXXXXXXXXXXXXXXX/v1';
const clientId = 'XXXXXXXXXXXXXXXXXXX';
const idpConnection = new OktaAdapter();
const tokenPermissionsClaim = 'scp';

// Declarations of endpoints and state in this application.
//

const apiPort = 8000;
const apiUri = `http://localhost:${apiPort}`;                           // The URI to the API.
const apiAudience = apiUri;                                             // The audience for the access token; the URI is a unique name.
const authorizationRedirect = 'http://localhost:9000/authorize';        // The callback after authentication in this app.
const leadTimeToRefresh = 600000;                                       // Refresh the access token when time is within this many milliseconds.
const signoutRedirect = 'http://localhost:9000';                         // The landing page after logout in this app.

// Declarations of endpoints in the Pirates API

const ships = `${apiUri}/ships`;
const treasure = `${apiUri}/treasure`;

export { apiAudience, apiPort, apiUri, authorizationRedirect, authorizationServerUri, clientId, idpConnection, leadTimeToRefresh, signoutRedirect, ships, tokenPermissionsClaim, treasure };