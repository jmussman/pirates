// shipsService.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import { idpConnection, ships } from 'main/config';

const read = async () => {

    // AJAX request to get the public ships list.

    let [ idToken, accessToken, refreshToken ] = idpConnection.getTokens();

    let headers = {
        Accept: 'application/json',
    }

    if (accessToken) {

        headers.authorization = `Bearer ${accessToken}`;
    }

    return await $.ajax({ type: 'GET', url: `${ships}`, headers: headers, crossDomain: true, cache: false });
}

export { read };