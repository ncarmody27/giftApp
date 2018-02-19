// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
//requires mongodb(defined in crud.js), url set there as well
var CRUD = require('./modules/crud.js');
//client sessions is a cookie manager that encrypts cookies
var session = require('client-sessions');
app.use(session({
  cookieName: 'session',
  secret: '5Ts8W^My%5g#',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('client'));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var render = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('/api in use');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
		res.render('api.html',{message: 'to our API!'}); 
});


// more routes for our API will happen here
const request = require('request-promise');

const userAccessToken = appAccess();
router.post('/facebookUpsert', function(req, res){
	var accessToken = req.query.accessToken;
	var userID = req.query.userID;
	const userFieldSet = 'id, name, email, picture';
	
	const options = {
		method: 'GET',
		uri: `https://graph.facebook.com/v2.12/${userID}`,
		qs: {
			access_token: accessToken,
			fields: userFieldSet
		}
	};
	console.log(options);
	request(options).then(fbRes => {
		console.log(fbRes);
		//upserts user info
		CRUD.upsert('users', req, res);
		//logs in
		CRUD.readEmail('users', req, res, function(err, user) {
    if (user === false) {
      res.render('signIn.html', { error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user[0].password) {
				// sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/home');
      } else {
        res.render('signIn.html', { error: 'Invalid email or password.' });
      }
    }
  });
	})
});

// create a user (accessed at POST http://localhost:8080/api/user)
router.post('/user', function (req, res) {
  CRUD.create('users', req, res, true);
	CRUD.readEmail('users', req, res, function(err, user) {
    if (user === false) {
      res.render('signIn.html', { error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user[0].password) {
				// sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/home');
      } else {
        res.render('signIn.html', { error: 'Invalid email or password.' });
      }
    }
  });
	
	
	//redirect to user page
});
//Get all (http://localhost:8080/api/users)
router.get('/users',function(req, res) {
	CRUD.readAll('users',req,res, false);	
});

//Read by id (http://localhost:8080/api/user/:id)
router.get('/user/:_id', function(req, res){
	CRUD.readId('users',req,res, false);
});

router.get('/login', function (req, res){
	res.render('signIn.html', {error:''});
});

//user login route
router.post('/login', function(req, res) {
	CRUD.readEmail('users', req, res, function(err, user) {
    if (user === false) {
      res.render('signIn.html', { error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user[0].password) {
				// sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/home');
      } else {
        res.render('signIn.html', { error: 'Invalid email or password.' });
      }
    }
  });
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.render('signIn.html',{error: 'session expired please log in'});
  } else {
    next();
  }
};

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    CRUD.readEmail('users', req, res, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

//update (accessed at POST http://localhost:8080/api/user/id)
router.post('/user/:_id',function(req, res) {
	CRUD.update('users',req,res);
	CRUD.readId('users',req, res, false);
});

//delete user (accessed at DELETE http://localhost:8080/api/user/id)
router.delete('/user/:_id',function(req, res) {
	CRUD.del('users',req,res);
});

//RENDERING OF PAGES
//homepage (will check for login)
//accessed at get http://localhost:8080/home
render.get('/', requireLogin, function(req, res){
	//get login info from cookie
	//callback will give us an object which will contain info to generate page
	/*var callback = function(docs){
		return docs;
	};
	var userinfo = CRUD.readId('users',req,res, callback);*/
	console.log(req.session.user);
	res.render('home.html',{user: req.session.user});
	//callback = CRUD.getUserWishlists(){return userInfoObject};
	
	//userinfo object will contain {wishlists:[listOfWishlists]};
	/*res.render('userpage.html', {userpageobject:'info',wishlists:[listOfWishlists]unpacked by nunjucks template});*/
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use('/home', render);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
