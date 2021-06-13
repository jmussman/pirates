// index.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

import $ from 'jquery';
import "core-js/stable";
import "regenerator-runtime/runtime";

import siteController from 'main/siteController';

// Make sure assets are loaded.

import './assets/images/pirate-ship.png';
import './assets/images/title.png';
import './assets/images/jolly-roger-black-square-100.png';
import './assets/style/site.css';

$(() => {

    // Initial call to the router to kick things off.
    
    siteController();
});