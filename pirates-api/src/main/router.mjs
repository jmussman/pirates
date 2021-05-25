// router.mjs
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// This is pretty much the simplest express web service ever, the only point is to add OAuth2 authorization
// in the form of an access token. The two routing methods are async because loading a missing key or
// validating the access token using introspection is asynchronous.
//

import { idpConnection } from '../config/config.mjs';
import cors from 'cors';
import express, { Router } from 'express';

import { port } from '../config/config.mjs';

const router = () => {

    const app = express();

    app.use(cors());

    app.get('/ships', async (req, res) => {

        const ships = [
            { _id: '99db5163-e2e1-4d98-bc53-7f628554a331', name: 'Queen Anne\'s Revenge', class: 'Frigate', tons: 200, guns: 40, condition: 'needs some work' },
            { _id: 'b8acee6e-f0a5-45de-8d0a-a2e746c90eca', name: 'William', class: 'Sloop', tons: 12, guns: 4, condition: 'excellent' },
            { _id: '14695550-7df5-4db5-8286-9a3cdd50f25d', name: 'Whydah Gally', class: 'Galley', tons: 300, guns: 28, condition: 'severe water damage' },
            { _id: '924f2a6d-e695-4f13-8ca9-50d2b7d1629b', name: 'Revenge', class: 'Sloop', tons: 30, guns: 10, condition: 'good' },
            { _id: '14695550-7df5-4db5-8286-9a3cdd50f25d', name: 'Fancy', class: 'Man-o-war', tons: 800, guns: 46, condition: 'excellent' },
        ];

        // If there is a header and it does not validate return 401.

        if (!req.headers.authorization || await idpConnection.validate(req.headers.authorization, 'read:ships')) {
                    
            res.set('content-type', 'application/json')
            res.send(JSON.stringify(ships));   

        } else {

            res.status(401).send('Access denied.');
        }
    });

    app.get('/treasure', async (req, res) => {

        const treasure = [

            { _id: 'acdcd7f6-10f1-4030-a5f8-73da8000bceb', date: '1695', amount: 600000, prize: 'Ganj-i-Sawai', ship: 'Fancy', captain: 'Long Ben' },
            { _id: '35059dc7-5d89-44b5-b191-6e31820ac6e3', date: '1693', amount: 180000, prize: 'Unknown dhow', ship: 'Amity', captain: 'The Rhode Island Pirate' },
            { _id: '63baab34-263f-4424-bec2-6ead385e69f9', date: '1723', amount: 15000, prize: 'Nostra Signiora de Victoria', ship: 'Squirrel', captain: 'Ned Low' },
            { _id: '0bc78240-5110-4191-8448-bf1769da191b', date: '1721', amount: 2700, prize: 'Unknown slaver', ship: 'Unknown brigatine', captain: 'Charles Vane' },
            { _id: '09dc6d7b-fad2-449d-9130-384477138753', date: '1723', amount: 150, prize: 'Fortune', ship: 'Fancy', captain: 'Ned Low' },
        ];

        // If there is not a header or it does not validate return 401.

        if (req.headers.authorization && await idpConnection.validate(req.headers.authorization, 'read:treasure')) {
                    
            res.set('content-type', 'application/json')
            res.send(JSON.stringify(treasure));   

        } else {

            res.status(401).send('Access denied.');
        }
    });

    console.log(`Web service listening on port ${port}`)
    app.listen(port)
}

export default router;