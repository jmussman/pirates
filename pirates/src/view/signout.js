// signout.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

const signout = (show) => {

    if (show) {
        
        $('#sign-out').show();
        $('#sign-in').hide();

    } else {
        
        $('#sign-out').hide();
        $('#sign-in').show();
    }
}

export default signout;