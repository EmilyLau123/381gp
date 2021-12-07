

const app = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');

//user session setting
const SECRETKEY = 'Logged in';



app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//setting view engine to ejs
app.set("view engine", "ejs");

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.status(200).render('secrets',{name:req.session.username});
	}
});

app.get( '/login', (req,res) => {
      res.status(200).render('login',{});
    });

app.post('/login', (req,res) => {
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

app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.get( '/home', (req,res) => {
    console.log('home',req.query);

    res.render('home',{username:req.query})
    });

app.get( 'find', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

app.post( '/create', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

app.put( '/update', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

app.delete( '/remove', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });

app.get( '/error', (req,res) => {
   res.set('Content-Type','text/html');  // send HTTP response header
   res.status(200).end(login());
   });
//     case '/find':
//         handle_Find(res, parsedURL.query);
//         break;
       

//   default:
//      res.writeHead(404, {"Content-Type": "text/plain"});
//      res.end("404 Not Found\n");
app.get('/*', (req, res) => {  // default route for anything else
   res.set('Content-Type', 'text/plain');
   res.status(404).end("404 Not Found");
 })

// const server = app.listen(process.env.PORT || 8099, () => {
// const port = server.address().port;
// console.log(`Server listening at port ${port}`);
// });

module.exports = app;
