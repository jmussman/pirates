// authenticate.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import { idpConnection } from '../config/config.mjs';

const authenticate = (state) => {

    let result = false;
    let [ idToken ] = idpConnection.getTokens();

    if (idToken) {

        // The user is already authenticated!

        result = true;

    } else {
    
        idpConnection.authenticate(state);  // This leaves the application.
    }

    return result;
}

export default authenticate;