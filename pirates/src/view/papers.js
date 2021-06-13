// papers.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';

import { idpConnection } from 'main/config';
import breadcrumbs from 'view/breadcrumbs';
import { getPayload } from 'authentication/token';

const papers = () => {

    let content = breadcrumbs('Identity Papers');
    let [ idToken, accessToken, refreshToken ] = idpConnection.getTokens();
    
    if (idToken) {

        // Only display tokens if there is an ID token; if we reached this and there is not an ID token
        // the OIDC authentication sequence lagged behind the javascript call so ignore it.

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
    }
}

export default papers;