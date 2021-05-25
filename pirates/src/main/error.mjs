// error.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from './breadcrumbs.mjs';

const error = (message) => {

    let content = breadcrumbs('Error');

    content.append($('<div>', { class: `error${message.length > 20 ? ' error-small' : ''}` }).append(message));
    $('.content').append(content);
}

export default error;