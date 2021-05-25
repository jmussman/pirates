// config.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

const idpDomain = '';

// Declarations of endpoints and state in this application.
//

const apiAudience = 'http://localhost:8000';                            // The audience for the access token (matches IdP configuration).
const port = 8000;                                                      // Service port.

// The IdpConnection that will be used for this application.
//

let idpConnection = null;

// import OktaAdapter from '../authorization/OktaAdapter.mjs';
// idpConnection = new OktaAdapter();

// import Auth0Adapter from '../authorization/Auth0Adapter.mjs';
// idpConnection = new Auth0Adapter();

export { apiAudience, idpConnection, idpDomain, port };