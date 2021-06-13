// ships.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from 'view/breadcrumbs';

const ships = async (shipList) => {

    // Render the list of ships.

    let content = breadcrumbs('Ships');
    let table = $('<table>');
    let tbody = $('<tbody>');
    
    table.append($('<thead>')
        .append($('<tr>'))
            .append($('<th>').append('Name'))
            .append($('<th>').append('Class'))
            .append($('<th>').append('Tons'))
            .append($('<th>').append('Guns'))
            .append($('<th>').append('Condition')));

    for (let ship of shipList) {

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

export default ships;