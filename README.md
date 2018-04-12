# auth0-authy-sample-app
This is the sample app for setting up Authy TOTP 2FA with Auth0

# Installation

1. Install Dependencies
    ```
    $ cd auth0-authy-sample-app
    $ npm install
    ```
1. Gather Credentials
    * Your Auth0 domain, client ID, and client secret, obtainable [from the Auth0 dashboard](https://manage.auth0.com/)
    * Your [Auth0 Management API Token](https://auth0.com/docs/api/management/v2)
    * A [webtask.io](https://webtask.io) account, and your webtask.io profile name: the value of the -p parameter shown at the end of the code in Step 2 of the [Account Settings > Webtasks](https://manage.auth0.com/#/account/webtasks) page.
1. Create `.env` file, replacing bracketed items with appropriate secrets:
    ```bash
    AUTH0_DOMAIN="[Your Auth0 Domain]"
    AUTH0_CLIENT_ID="[Your Auth0 Client ID]"
    AUTH0_CLIENT_SECRET="[Your Auth0 Client Secret]"
    AUTH0_CALLBACK="http://localhost:3000/callback"
    AUTHY_API_KEY="[Your Authy API Key]"
    AUTH0_MANAGEMENT_TOKEN="[Your Auth0 Management API Token]"
    ```
1. Copy `run-wt.sample` to `run-wt`
    ```bash
    $ cp run-wt.sample run-wt
    ```
1. Modify `run-wt`, replacing bracketed items with appropriate secrets:
      ```bash
      #! /bin/bash

      wt create --name authy-mfa \
          --secret authy_api_key=[YOUR_AUTHY_API_KEY] \
          --secret auth0_clientID=[YOUR_AUTH0_CLIENT_ID] \
          --secret auth0_secret=[YOUR_AUTH0_CLIENT_SECRET] \
          --secret auth0_clientID=[YOUR_AUTH0_CLIENT_ID] \
          --secret returnUrl=https://[YOUR_AUTH0_DOMAIN]/continue \
          --output json \
          --profile YOUR_AUTH0_WEBTASK_PROFILE \
          authy-mfa-wt.js

      ```
1. Make `run-wt` executable
    ```bash
    $ chmod +x run-wt
    ```
1. [Install the webtask cli](https://webtask.io/docs/101) if you haven't already
1. Deploy your webtask:
    ```bash
    $ ./run-wt
    ```
1. Make note of the `url` and `container` value that is returned by the previous step. These are is *your Webtask URL* and *your Webtask container*.
    ```bash
    {
      "url": "[Your Webtask URL]",
      "name": "authy-mfa",
      "container": "[Your Webtask Container]"
    }
    ```
1. Copy `rule.js.sample` to `rule.js`. You will deploy the contents of this file to the [Auth0 rules engine](https://auth0.com/docs/rules/current):
    ```bash
    $ cp rules.js.sample rules.js
    ```
1. Modify `rule.js`, replacing bracketed items with appropriate secrets:
    ```javascript
    var configuration = {
      CLIENT_ID: '[Your Auth0 Client ID]',
      CLIENT_SECRET: '[Your Auth0 Client Secret]',
      ISSUER: '[Your Auth0 Domain]'
    };

    ...

    //Trigger MFA
    context.redirect = {
        url: '[Your Webtask Url]?webtask_no_cache=1&token=' + token
    };
    ```
1. [Open the rules tab in the dashboard](https://manage.auth0.com), create a new rule, and paste the modified contents of `rule.js` into the editor window, and click 'Save'.
1. Run the server
    ```bash
    $ node bin/www
    ```
1. Navigate to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> in your browser.

## Caveat

There is a caveat with this project. If you're going to log into a social provider and use 2FA, **you'll need to use your own dev keys with the social connection, or the rule will fail.**

Using email/password combination works just fine no matter the situation.
