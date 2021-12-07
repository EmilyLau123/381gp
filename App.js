const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const formidable = require('express-formidable');


//https://developer.mozilla.org/zh-TW/docs/Learn/Server-side/Express_Nodejs/skeleton_website
const mongourl = 'mongodb+srv://emily:emily@cluster0.qqjdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'test';

//routers
var indexRouter = require('./router');
//var usersRouter = require('./routes/users');
//app.use(formidable());

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

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });



const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body><ul>');
            for (var doc of docs) {
                //console.log(doc);
                res.write(`<li>Booking ID: ${doc.bookingid}, Mobile: ${doc.mobile}`);
            }
            res.end('</ul></body></html>');
        });
    });
}
const server = app.listen(process.env.PORT || 8099, () => {
    const port = server.address().port;
    console.log(`Server listening at port ${port}`);
  });

module.exports = app;
