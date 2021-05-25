// authorize.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import { idpConnection } from '../config/config.mjs';
import error from './error.mjs';

const authorize = async () => {

    let params = (new URL(document.location)).searchParams;

    if (!location.search) {

        // Some IdPs (e.g. Okta) have the habit of sending a query-string encoded hash
        // instead of the actual query string, so we have to make that look like the query
        // string for the IdpConnection object. decodeURIComponent doesn't interpret +, which
        // may be used for ' ' instead of %20, so that must be handled as well.

        const hashPairs = location.hash.substring(1).split('&');

        for (let hashPair of hashPairs) {

            const [name, value] = hashPair.split('=');

            params.append(decodeURIComponent(name).replace(/\+/g, ' '), decodeURIComponent(value).replace(/\+/g, ' '));
        }
    }

    // Call the authorize function from whatever IdP module was passed in from the configuration.
    // The presentation is handled on this side, so switch to the state indicated or log the error.
    
    try {

        await idpConnection.authorize(params)

        // This should not cause a loop, because we only get here if the idToken is set and the
        // "second" time through the router "authorize" will see it.

        $('#sign-in').hide();
        $('#sign-out').show();
        history.pushState({}, '', params.get('state'));    
    }

    catch(err) {

        console.log(err);
        error(err);    
    }
}

export default authorize;