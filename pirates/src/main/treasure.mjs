// treasure.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from './breadcrumbs.mjs';
import { apiUri, idpConnection } from '../config/config.mjs';
import error from './error.mjs';

const booty = async () => {

    // AJAX request to get the members private treasure leader board.

    try {

        let [ idToken, accessToken, refreshToken ] = idpConnection.getTokens();
        let content = breadcrumbs('Treasure');

        let headers = {
            Accept: 'application/json',
        }

        if (accessToken) {

            headers.authorization = `Bearer ${accessToken}`;
        }

        let ships = await $.ajax({ type: 'GET', url: `${apiUri}/treasure`, headers: headers, crossDomain: true, cache: false });

        let table = $('<table>');
        let tbody = $('<tbody>');
        
        table.append($('<thead>')
            .append($('<tr>'))
                .append($('<th>').append('Captain'))
                .append($('<th>').append('Ship'))
                .append($('<th>').append('Date'))
                .append($('<th>').append('Prize'))
                .append($('<th>').append('Value')));

        for (let ship of ships) {

            tbody.append($('<tr>'))
                .append($('<td>').append(ship.captain))
                .append($('<td>').append(ship.ship))
                .append($('<td>').append(ship.date))
                .append($('<td>').append(ship.prize))
                .append($('<td>', { class: 'align-right' }).append('&pound;' + ship.amount));
        }

        table.append(tbody);
        content.append(table);
        $('.content').append(content);
    }

    catch (res) {

        error(`${res.status}: ${res.responseText}`);
    }
}

export default booty;