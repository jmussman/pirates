![](.common/joels-private-stock.png?raw=true)

# Pirates

The purpose of Pirates is to demonstrate decoupling identity form an application and adding the functionality of
an identity provider (IdP) and shared/trusted/federated user authentication!

![](.common/auth+auth-800x354.png)

There are two pieces to Pirates, a single-page web application that interfaces with the user and a web
service API that the SPA connects to.
The project needs authentication and authorization: authentication to identify the user and authorization
to let the user into private areas and for the application to use the API on behalf of the authenticated user.
Both projects are kept in the same repository to make management of the demonstration simple.

The applications (SPA and API) are completely written except for the authentication and authorization part.
Some supporting code for authentication and authorization is present to speed up the demonstration, but the
focus is on adding in the primitive REST operations to implement the flow.

The application should work with any OIDC/OAuth 2 compliant IdP such as Okta or Auth0.
The IdP will need to be configured with the SPA (we need the "client id"), and the API (we need the
"authorization server" URL for the API).
The API configuration should claim two scopes for the authenticated user: "read:ships" and "read:treasure", because the API
will check for the appropriate scope when the /ships and /treasure endpoints are used.

## License

The code is licensed under the MIT license.
You may use and modify all or part of it as you choose, as long as attribution to the source is provided per the license.
See the details in the [license file](./LICENSE.md) or at the [Open Source Initiative](https://opensource.org/licenses/MIT)

### Configuration

Create a development tenant at Okta or Auth0 with a group of users: see [Pirates of the Caribbean](https://github.com/jmussman/piratesofthecaribbean)
for a list of pirate names.
Configure the application and authorization servers to authenticate these users and provide
access tokens with the "read:ships" and "read:treasure" scopes.
Enable refresh token rotation for the application.

Each project has its own folder: "pirates" and "pirates-api".
Run "npm install" in each project folder, and "npm start" to launch each project.
It doesn't really matter if the service launched second, the application does not use it until "Ships" or "Treasure" is selected
from the menu.

Both the SPA and API run with a web server that recompiles and reloads on file changes.

Follow the instructions in the guide (under resources/documents) to progress through the demonstration.

<hr>
Copyright © 2021 Joel Mussman. All rights reserved.