function (user, context, callback) {
  var configuration = {
    CLIENT_ID: 'AUTH0_CLIENT_ID',
    CLIENT_SECRET: 'AUTH0_CLIENT_SECRET',
    ISSUER: 'AUTH0_DOMAIN'
  };
  
  //check that user has activated authy
  if(!user.app_metadata || !user.app_metadata.authyID){
    //if not, send them back to activate authy
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.needsAuthyActivation = true;
  } else {
    //Returning from OTP validation
    if(context.protocol === 'redirect-callback') {
      verifyToken(
        configuration.CLIENT_ID,
        configuration.CLIENT_SECRET,
        'auth0:authy:mfa',
        context.request.query.token,
        postVerify
      );
    } else {
      var token = createToken(
        configuration.CLIENT_ID,
        configuration.CLIENT_SECRET,
        configuration.ISSUER, {
          sub: user.user_id,
          email: user.email,
          authySID: user.app_metadata.authyID 
        }
      );

      //Trigger MFA
      context.redirect = {
          url: 'YOUR_WEBTASK_URL?webtask_no_cache=1&token=' + token
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
      return callback(new UnauthorizedError("Authy MFA failed"));
    } else {
      // User's password has been changed successfully
      return callback(null, user, context);
    }
  }   
}