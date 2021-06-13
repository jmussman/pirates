// Oktadapter.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This class extends the template-method design pattern: _keyPath is used to define the URL for Auth0,
// but the methods inherited from IdpConnection do the bulk of the work.
//

import fetch from 'node-fetch';

import { authorizationServerUri } from 'main/config';
import IdpConnection from 'authorization/IdpConnection';

class OktaAdapter extends IdpConnection {

    async publicKeys() {

        // Load and return the public keys from the IdP.

        const response = await fetch(`${authorizationServerUri}/keys`);
        
        return await response.json(response);
    }
}

export default OktaAdapter;