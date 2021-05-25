// papers.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import breadcrumbs from './breadcrumbs.mjs';
import { idpConnection } from '../config/config.mjs';
import error from './error.mjs';
import { getPayload } from '../authentication/token.mjs';

const papers = () => {

    let content = breadcrumbs('Identity Papers');
    let [ idToken, accessToken, refreshToken ] = idpConnection.getTokens();
    
    if (idToken) {

        // Only display tokens if there is an ID token; if we reached this and there is not an ID token
        // the the authorization/authentication sequence is broken (or not invoked).

        let idTokenPayload = JSON.stringify(getPayload(idToken), undefined, 4);

        content.append($('<div>', { class: 'codeblock' }).append($('<h1>').append('ID Token')).append(idTokenPayload));

        if (accessToken) {

            let accessTokenPayload = JSON.stringify(getPayload(accessToken), undefined, 4);    

            content.append($('<div>', { class: 'codeblock' }).append($('<h1>').append('Access Token')).append(accessTokenPayload));
        }
        
        if (refreshToken) {

            content.append($('<div>', { class: 'codeblock' }).append($('<h1>').append('Refresh Token')).append(refreshToken));  
        }

        $('.content').append(content);
        
    } else {

        error('Missing tokens - not signed-in');
    }
}

export default papers;