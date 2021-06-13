// Router.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This example maintains simplicity, and for that reason the (simpler) hash model is used for changing state in the SPA.
//

import $ from 'jquery';

import { idpConnection } from 'main/config';
import error from 'view/error';
import signout from 'view/signout';
import papers from 'view/papers';
import home from 'view/home';
import ships from 'view/ships';
import { read as readShips } from 'service/shipsService';
import treasure from 'view/treasure';
import { read as readTreasure } from 'service/treasureService';

// Override the pushState method on history to emit a 'statechanged' event.

const oldPushState = history.pushState;

history.pushState = (state, title, url) => {

    oldPushState.call(history, state, title, url);
    dispatchEvent(new Event('statechanged'));
}

// Set up the route handler to trigger state changes on hash update.

$(window).on('statechanged', () => {

    siteController();
});

// siteController
//
// The job of the controller is to decide what has to happen next and the view displayed after that.
// This includes deciding if authentication is required before proceeding, and causing the correct
// view to be displayed on errors.
//

const siteController = async () => {

    // Clear existing content in the display.

    $('.content').empty();

    try {

        // Route based on the URL. The route decides if authentication and authorization is
        // required before changing state.

        let state = location.pathname;

        switch (state) {
            case '/':
                home();
                break;

            case '/authorize':
                // This is the endpoint called by the IdP at the end of the authentication flow.
                // Because this endpoint is actually in the SPA, the web server must pass this
                // through as a request for the SPA page itself.
                let landingState = await idpConnection.authorize()
                signout(true);
                history.pushState({}, '', landingState);
                break;

            case '/sign-out':
                idpConnection.invalidateTokensAndSignout();
                signout(false);
                history.pushState({}, '', '/');
                break;

            case '/papers':
                await idpConnection.authenticate(state);
                papers();
                break;

            case '/sign-in':
                await idpConnection.authenticate(state);
                history.pushState({}, '', '/');
                break;

            case '/ships':
                let shipList = await readShips();
                ships(shipList); 
                break;
        
            case '/treasure':
                await idpConnection.authenticate(state);
                let leaderBoard = await readTreasure();
                treasure(leaderBoard);
                break;
        
            default:
                throw new Error('404 - not found');
        }
    }

    catch(err) {

        // This could be a response error or an internal error.

        error(err.status ? `${err.status}: ${err.responseText}` : err);
    }
}

export default siteController;