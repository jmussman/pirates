// config.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

// Idp configuration.
//

import { idpConnection } from 'authorization/Auth0Adapter';

const authorizationServerUri = 'https://dev-XXXXXXXX.okta.com/oauth2/ausXXXXXXXXXXXXXXXXX';
const tokenPermissionsClaim = 'scp';

// Declarations of endpoints and state in this application.
//

const apiPort = 8000;                               // Service port.
const apiAudience = `http://localhost:${apiPort}`;  // The audience for the access token (matches IdP configuration).

// Get the OIDC discovery document.
//

const oidcDiscovery = await idpConnection.getDiscovery(`${authorizationServerUri}/.well-known/openid-configuration`);

export { apiAudience, apiPort, idpConnection, oidcDiscovery, tokenPermissionsClaim };