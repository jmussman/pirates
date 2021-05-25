// ships.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from './breadcrumbs.mjs';
import { apiUri, idpConnection } from '../config/config.mjs';
import error from './error.mjs';

const ships = async () => {

    // AJAX request to get the public ships list.

    try {

        let [ idToken, accessToken, refreshToken ] = idpConnection.getTokens();
        let content = breadcrumbs('Ships');

        let headers = {
            Accept: 'application/json',
        }

        if (accessToken) {

            headers.authorization = `Bearer ${accessToken}`;
        }

        let ships = await $.ajax({ type: 'GET', url: `${apiUri}/ships`, headers: headers, crossDomain: true, cache: false });

        let table = $('<table>');
        let tbody = $('<tbody>');
        
        table.append($('<thead>')
            .append($('<tr>'))
                .append($('<th>').append('Name'))
                .append($('<th>').append('Class'))
                .append($('<th>').append('Tons'))
                .append($('<th>').append('Guns'))
                .append($('<th>').append('Condition')));

        for (let ship of ships) {

            tbody.append($('<tr>'))
                .append($('<td>').append(ship.name))
                .append($('<td>').append(ship.class))
                .append($('<td>', { class: 'align-right' }).append(ship.tons))
                .append($('<td>', { class: 'align-right' }).append(ship.guns))
                .append($('<td>').append(ship.condition));
        }

        table.append(tbody);
        content.append(table);
        $('.content').append(content);
    }

    catch (res) {

        error(`${res.status}: ${res.responseText}`);
    }
}

export default ships;