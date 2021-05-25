// Auth0Adapter.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This class extends the template-method design pattern: _keyPath is used to define the URL for Auth0,
// but the methods inherited from IdpConnection do the bulk of the work.
//

import { idpDomain } from '../config/config.mjs';
import IdpConnection from './IdpConnection.mjs';

class Auth0Adapter extends IdpConnection {

    _keyPath() {

        return `${idpDomain}/.well-known/jwks.json`;
    }
}

export default Auth0Adapter;