

const express = require('express');
const session = require('cookie-session');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const assert = require('assert');
const formidable = require('express-formidable');

// const router = express.Router();


const app = express();

//user session setting
const SECRETKEY = 'Logged in';
// app.use("/",router);


app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

const users = new Array(
	{username: 'student', password: ''},
	{username: 'demo', password: ''}
);

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//setting view engine to ejs
app.set("view engine", "ejs");

const findDocument = (db, criteria, callback) => {
    if(criteria == ''){
        var cursor = db.collection('inventories').find();
    }else{
        criteria = JSON.stringify(criteria).replaceAll('"','');
        var cursor = db.collection('inventories').find({name:criteria});
    }
    console.log(criteria);
    
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        console.log(`Document: ${JSON.stringify(docs[0])}`);
        callback(docs);
    });
}
//route
app.get('/', (req,res) => {
	//console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.redirect('/home');
		//res.status(200).render('home',{name:req.session.username});
	}
});


app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
    //console.log('body'+req.params.name);
    console.log(req.body.name);

	users.forEach((user) => {
        console.log(user.username);
		if (user.username == req.body.name && user.password == req.body.password) {
            console.log('correct');
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true
			req.session.username = req.body.name;	 // 'username': req.body.name		
		}
	});
	res.redirect('/');
});


app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.get( '/home', (req,res,callback) => {
    // if(req.session.authenticated){
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            const criteria = '';
            
            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("Closed DB connection");
                //res.status(200).render('list',{ninventories: docs.length, inventories: docs});
                let result = `${JSON.stringify(docs)}`
                console.log(`${JSON.stringify(docs[0])}`);
                // let html = '';
                // docs.forEach((doc) => {
                //     html += '<div class="card">';
                //     html += '<div class="container">';
                //     html += '<a href="/api/inventory/name/'+doc.name+'>'+JSON.stringify(doc.name).replaceAll('"','')+'</a><br>';
                //     html += 'Manager:'+JSON.stringify(doc.manager).replaceAll('"','') + '</div>';
                      
                // });
                // console.log(html);
                res.render('home',{name:req.session.username,
                    data:docs,
                    })
                })
            });
});
//ejs
// <!-- <% data.forEach(function(doc){ %>
//     <div class="card">
//         <div class="container">
//             <a href="/api/inventory/name/<%= doc.name %>"><%- JSON.stringify(doc.name).replaceAll('"','') %></a><br>
//             Manager: <%- JSON.stringify(doc.manager) %>
//         </div>
//       </div>  
//     <% }); %> -->

            /*
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><H2>inventories (${docs.length})</H2><ul>`);
            for (var doc of docs) {
                //console.log(doc);
                res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
            }
            res.end('</ul></body></html>');
            */
         

app.get( '/api/inventory/name/:name', (req,res) => {
    res.send("inventory name is set to " + req.params.name);
   });

app.get( '/api/inventory/create', (req,res) => {
    res.render('create',{})
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
// app.get('/*', (req, res) => {  // default route for anything else
//    res.set('Content-Type', 'text/plain');
//    res.status(404).end("404 Not Found");
//  })
app.listen(process.env.PORT || 8099);

// const server = app.listen(process.env.PORT || 8099, () => {
// const port = server.address().port;
// console.log(`Server listening at port ${port}`);
// });

module.exports = app;
// export default router;
