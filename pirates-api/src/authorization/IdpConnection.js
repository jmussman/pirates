// IdpConnection.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This class implements the template-method design pattern: the _keyPath method is implemented in the
// sub-class to define the URL to get the keys, while the bulk of the work remains in this class.
//

import fetch from 'node-fetch';

class IdpConnection {

    async getDiscovery(discoveryUri) {

        const response = await fetch(discoveryUri);
            
        return await response.json(response);
    }

    async publicKeys() {

        // This method is overridden in the sub-class to return the URL to retrieve the public keys.
    }
}

export default IdpConnection;