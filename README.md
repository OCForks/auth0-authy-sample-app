# auth0-authy-sample-app
This is the sample app for setting up Authy TOTP 2FA with Auth0

# Installation

1. Install Dependencies

```
npm install
```

2. Create a .env file with the following

```
AUTH0_DOMAIN="yourdomain.auth0.com"
AUTH0_CLIENT_ID="your_client_id"
AUTH0_CLIENT_SECRET="your_client_secret"
AUTH0_CALLBACK_URL="localhost:3000/callback"
AUTHY_API_KEY="authy_api_key"
```

# Running the app

```
npm start
```

or (if you have `nodemon` installed):

```
npm script dev
```

