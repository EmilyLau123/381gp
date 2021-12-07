

const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
var router = express.Router();

router.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.status(200).render('secrets',{name:req.session.username});
	}
});

router.get( '/login', (req,res) => {
      res.status(200).render('login',{});
    });

router.post('/login', (req,res) => {
   console.log(req.body);
   users.forEach((user) => {
      if (user.username == req.body.username && user.password == req.body.password) {
         // correct user name + password
         // store the following name/value pairs in cookie session
         req.session.authenticated = true;        // 'authenticated': true
         req.session.username = req.body.username;	 // 'username': req.body.name		
         }
      });
      res.redirect('/');
});

router.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

router.get( '/home', (req,res) => {
    console.log('home',req.query);

    res.render('home',{username:req.query})
    });

router.get( 'find', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

router.post( '/create', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

router.put( '/update', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

router.delete( '/remove', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

router.get( '/error', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });
//     case '/find':
//         handle_Find(res, parsedURL.query);
//         break;
       

//   default:
//      res.writeHead(404, {"Content-Type": "text/plain"});
//      res.end("404 Not Found\n");
router.get('/*', (req, res) => {  // default route for anything else
   res.set('Content-Type', 'text/plain');
   res.status(404).end("404 Not Found");
 })

// const server = router.listen(process.env.PORT || 8099, () => {
// const port = server.address().port;
// console.log(`Server listening at port ${port}`);
// });

module.exports = router;
