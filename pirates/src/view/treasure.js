// treasure.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from 'view/breadcrumbs';

const treasure = async (leaderBoard) => {

    // Render the treasure leader board.

    let content = breadcrumbs('Treasure');
    let table = $('<table>');
    let tbody = $('<tbody>');
    
    table.append($('<thead>')
        .append($('<tr>'))
            .append($('<th>').append('Captain'))
            .append($('<th>').append('Ship'))
            .append($('<th>').append('Date'))
            .append($('<th>').append('Prize'))
            .append($('<th>').append('Value')));

    for (let leader of leaderBoard) {

        tbody.append($('<tr>'))
            .append($('<td>').append(leader.captain))
            .append($('<td>').append(leader.ship))
            .append($('<td>').append(leader.date))
            .append($('<td>').append(leader.prize))
            .append($('<td>', { class: 'align-right' }).append('&pound;' + leader.amount));
    }

    table.append(tbody);
    content.append(table);
    $('.content').append(content);
}

export default treasure;