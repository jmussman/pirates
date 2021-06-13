// home.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

const home = () => {

    // This application uses hash-based routing because it is simpler to follow the code.

    const ships = $('<li>', { class: 'menuitem' }).append($('<a>', { href: "javascript: history.pushState({}, '', '/ships');" }).append('Ships'));
    const treasure = $('<li>', { class: 'menuitem '}).append($('<a>', { href: "javascript: history.pushState({}, '', '/treasure');" }).append('Treasure'));
    const letters = $('<li>', { class: 'menuitem' }).append($('<a>', { href: "javascript: history.pushState({}, '', '/papers');" }).append('Identity Papers'));
    const menu = $('<div>', { class: 'menu' }).append($('<ul>', { class: 'menu' }).append(ships).append(treasure).append(letters));
    const flex = $('<div>', { class: 'flex' }).append(menu);

    $('.content').append(flex);
}

export default home;