// breadcrumbs.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

const breadcrumbs = (title) => {
    
    return $('<div>', { class: 'breadcrumbs' }).append($('<a>', { href: "javascript: history.pushState({}, '', '/');" }).append('Pirates')).append('&nbsp;&rarr;&nbsp;').append(title);
}

export default breadcrumbs;