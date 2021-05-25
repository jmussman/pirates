// logout.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import { idpConnection } from '../config/config.mjs';

const logout = () => {

    // Ask the connection to logout the user.
    
    idpConnection.invalidateTokensAndLogout();

    // Hide the logout option on the main display if the logout action above does not leave the
    // application; this should only happen if something goes wrong with the navigation.

    $('#sign-out').hide();
    $('#sign-in').show();
    history.pushState({}, '', '/');
}

export default logout;