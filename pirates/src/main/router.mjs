// Router.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This example maintains simplicity, and for that reason the (simpler) hash model is used for changing state in the SPA.
//

import $ from 'jquery';

import authenticate from './authenticate.mjs';
import authorize from './authorize.mjs';
import error from './error.mjs';
import logout from './logout.mjs';
import papers from './papers.mjs';
import menu from './menu.mjs';
import ships from './ships.mjs';
import treasure from './treasure.mjs';

// Override the pushState method on history to emit a 'statechanged' event.

const oldPushState = history.pushState;

history.pushState = (state, title, url) => {

    oldPushState.call(history, state, title, url);
    dispatchEvent(new Event('statechanged'));
}

// Set up the route handler to trigger state changes on hash update.

$(window).on('statechanged', () => {

    router();
});

// Router

const router = () => {

    // Clear existing content in the display.

    $('.content').empty();

    // Route based on the URL. The route decides if authentication and authorization is
    // required before changing state.

    let state = location.pathname;

    switch (state) {
        case '/':
            menu();
            break;

        case '/authorize':      // This is the endpoint called by the IdP at the end of the authentication flow.
            authorize();
            break;

        case '/sign-out':
            logout();
            menu();
            break;

        case '/papers':
            if (authenticate(state)) {

                papers();
            }
            break;

        case '/sign-in':
            if (authenticate(state)) {

                menu();
            }
            break;

        case '/ships':
            ships();
            break;
    
        case '/treasure':
            if (authenticate(state)) {

                treasure();
            };
            break;
    
        default:
            console.log('unknown path', location.pathname);
            error('404 - not found');
            break;
    }
}

export default router;