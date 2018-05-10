function (user, context, callback) {

  if (context.clientID !== configuration.AUTHY_MFA_CLIENT_ID) {
      // Proceed without further action
      callback(null,user,context);
      return;
  }

  if (!user.app_metadata || !user.app_metadata.mfa || !(user.app_metadata.mfa.provider === "authy") ){
    //if not, send them back to activate authy
  } else {
    //Returning from OTP validation
    if(context.protocol === 'redirect-callback') {
      console.log("Redirect");
      console.log(configuration.AUTHY_MFA_CLIENT_ID);
      verifyToken(
        configuration.AUTHY_MFA_CLIENT_ID,
        configuration.AUTHY_MFA_CLIENT_SECRET,
        'auth0:authy:mfa',
        context.request.query.token,
        postVerify
      );
    } else {
      console.log("Continue to Authy");
      var token = createToken(
        configuration.AUTHY_MFA_CLIENT_ID,
        configuration.AUTHY_MFA_CLIENT_SECRET,
        configuration.AUTHY_MFA_ISSUER, {
          sub: user.user_id,
          email: user.email,
          authySID: user.app_metadata.mfa.payload.id
        }
      );

      //Trigger MFA
      context.redirect = {
          url: 'https://' + configuration.AUTHY_MFA_WEBTASK_DOMAIN + '/authy-mfa?webtask_no_cache=1&token=' + token
      };
    }
  }
  callback(null,user,context);

  // User has initiated a login and is forced to change their password
  // Send user's information in a JWT to avoid tampering
  function createToken(clientId, clientSecret, issuer, user) {
    var options = {
      expiresInMinutes: 1,
      audience: clientId,
      issuer: issuer
    };
    return jwt.sign(user, new Buffer(clientSecret, "base64"), options);
  }

  function verifyToken(clientId, clientSecret, issuer, token, cb) {
    console.log("ClientId, Token: ");
    console.log(clientId);
    console.log(token);
    jwt.verify(
      token,
      new Buffer(clientSecret, "base64").toString("binary"), {
        audience: clientId,
        issuer: issuer
      },
      cb
    );
  }
  function postVerify(err, decoded) {
    if (err) {
      console.log("Error: ");
      console.log(err);
      return callback(new UnauthorizedError("Authy MFA failed"));
    } else {
      console.log("Decoded: ");
      console.log(decoded);
      // User's password has been changed successfully
      return callback(null, user, context);
    }
  }
}
