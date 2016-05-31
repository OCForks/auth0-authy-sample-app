var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', env: env });
});

router.get('/login',
  function(req, res){
    res.render('login', { env: env });
  });

router.get('/login/error', function(req, res){
  res.end('login error')
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login/error' }),
  function(req, res) {
    if(!req.user._json.user_metadata || req.user._json.user_metadata.needsAuthyActivation){
      res.redirect('/user/activate')
    } else {
      res.redirect(req.session.returnTo || '/user');
    }
  });


module.exports = router;
