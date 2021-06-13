// config.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import OktaAdapter from 'authorization/OktaAdapter';

const authorizationServerUri = 'https://dev-XXXXXXXX.okta.com/oauth2/ausXXXXXXXXXXXXXXXXX/v1';
const idpConnection = new OktaAdapter();
const tokenPermissionsClaim = 'scp';

// Declarations of endpoints and state in this application.
//

const apiPort = 8000;                                                      // Service port.
const apiAudience = `http://localhost:${apiPort}`;                            // The audience for the access token (matches IdP configuration).

export { apiAudience, apiPort, authorizationServerUri, idpConnection, tokenPermissionsClaim };