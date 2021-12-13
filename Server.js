

const express = require('express');
const session = require('cookie-session');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const assert = require('assert');
const formidable = require('formidable');
var ObjectID = require('mongodb').ObjectId;
const fs = require('fs');
//leaflet setting
global.window = { screen: {} }
global.document = {
  documentElement: { style: {} },
  getElementsByTagName: () => { return [] },
  createElement: () => { return {} }
}
global.navigator = { userAgent: 'nodejs', platform: 'nodejs' }

const L = require('leaflet')



// const router = express.Router();

const mongourl='mongodb+srv://emily:emily@cluster0.qqjdp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = "test";

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

// 載入 method-override
const methodOverride = require('method-override') 

// 設定每一筆請求都會先以 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//setting view engine to ejs
app.set("view engine", "ejs");

const findDocument = (db, criteria, callback) => {
    // if(criteria == ''){
        var cursor = db.collection('inventories').find(criteria);
    // }else{
    //     criteria = JSON.stringify(criteria).replaceAll('"','');
    //     var cursor = db.collection('inventories').find({name:criteria});
    // }
    // console.log(criteria);
    
    // console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        // console.log(`findDocument: ${docs.length}`);
        // console.log(`Document: ${JSON.stringify(docs[0])}`);
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
                res.render('home',{name:req.session.username,
                    data:docs
                    });
                });
            });
});

app.get( '/api/inventory/name/:name', (req,res) => {
    const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            var criteria = {};
            //criteria['_id'] = ObjectID(req.params.id);
		criteria['name'] = req.params.name;
            
            findDocument(db, criteria, (docs) => {
		if(JSON.stringify(docs[0]) != undefined){

                client.close();
                console.log("Closed DB connection");
                //res.status(200).render('list',{ninventories: docs.length, inventories: docs});
                let result = `${JSON.stringify(docs)}`
                console.log('json'+`${JSON.stringify(docs[0])}`);
                
                res.status(200).end(JSON.stringify(docs[0]));
			}else{
			let emptyJson = {};
			res.status(500).end(JSON.stringify(emptyJson));
}
                });
            });
    
   });

app.get( '/inventory/name/:name', (req,res) => {
    const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            var criteria = {};
            //criteria['_id'] = ObjectID(req.params.id);
		criteria['name'] = req.params.name;
            
            findDocument(db, criteria, (docs) => {
		if(JSON.stringify(docs[0]) != undefined){

                client.close();
                console.log("Closed DB connection");
                //res.status(200).render('list',{ninventories: docs.length, inventories: docs});
                let result = `${JSON.stringify(docs)}`
                console.log('json'+`${JSON.stringify(docs[0])}`);
                
                res.status(200).render('detail',{
                    id:docs[0]._id,
                     name:docs[0].name,
                     type:docs[0].type,
                     street:docs[0].street,
                     building:docs[0].building,
                     zipcode:docs[0].zipcode,
                     country:docs[0].country,
                     manager:docs[0].manager,
                     image:"data:image/jpg;base64, "+docs[0].photo,
                     quantity:docs[0].quantity,
                     lat:docs[0].lanitude,
                     lon:docs[0].longitude,
                     zoom:15
                     
                    		});
			}else{
			let emptyJson = {};
			res.status(500).end(JSON.stringify(emptyJson));
}
                });
            });
    
   });


app.get( '/create', (req,res) => {
    res.status(200).render('create',{
        manager:req.session.username
    })
});

app.post( '/api/inventory/create', (req,res) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
            next(err);
            return;
            }
        console.log(req.body)
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            var criteria = {};

            let insertDoc = {};
            let json = JSON.parse(JSON.stringify(files));
            //console.log('json: '+json);
            Object.keys(fields).forEach((key) => {
                insertDoc[key] = fields[key];
                console.log('fields[key]: '+key+' - '+fields[key]);
            });
            console.log('files: '+JSON.stringify(files));
            //console.log('insertDoc: '+JSON.stringify(insertDoc));
            if (files.photo && files.photo.size > 0) {
                
                fs.readFile(files.photo.path, (err,data) => {
                    assert.equal(err,null);
                    insertDoc['photo'] = new Buffer.from(data).toString('base64');
                    //console.log('photo: '+insertDoc['photo']);
                    db.collection('inventories').insertOne(insertDoc,(err,results) => {
                        assert.equal(err,null);
                        client.close()
                        res.status(200).render('success',{
                            action:"Create"
                        });
                    })
                });
            } else {
                db.collection('inventories').insertOne(insertDoc,(err,results) => {
                    assert.equal(err,null);
                    client.close()
                    res.status(200).render('success',{
                        action:"Create"
                    });
                })
            }
        });
        });
    
});
app.get( '/update/id/:id', (req,res) => {
    const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            var criteria = {};
            criteria['_id'] = ObjectID(req.params.id);
            
            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("Closed DB connection");
                res.status(200).render('update',{
                id:docs[0]._id,
                name:docs[0].name,
                type:docs[0].type,
                quantity:docs[0].quantity,
                photo:docs[0].photo,
                street:docs[0].street,
                building:docs[0].building,
                country:docs[0].country,
                zipcode:docs[0].zipcode,
                lanitude:docs[0].lanitude,
                longitude:docs[0].longitude,
                manager:docs[0].manager
                });
            });
        });
    
});
//UPDATE
app.post( '/api/inventory/update/id/:id/manage/:manager', (req,res) => {
    console.log('params: '+req.params.manager+'session: '+req.session.username);
    if(req.params.manager == req.session.username){
    if (req.params.id) {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
            next(err);
            return;
            }
        //console.log(req.body)
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            var criteria = {};
            criteria['_id'] = ObjectID(req.params.id);

            let updateDoc = {};
            let json = JSON.parse(JSON.stringify(files));
            console.log('json: '+json);
            Object.keys(fields).forEach((key) => {
                updateDoc[key] = fields[key];
                console.log('fields[key]: '+key+' - '+fields[key]);
            });
            console.log('updateDoc: '+JSON.stringify(updateDoc));
            if (files.photo && files.photo.size > 0) {
                fs.readFile(files.photo.path, (err,data) => {
                    assert.equal(err,null);
                    updateDoc['photo'] = new Buffer.from(data).toString('base64');
                    db.collection('inventories').updateOne(criteria, {$set: updateDoc},(err,results) => {
                        assert.equal(err,null);
                        client.close()
                        res.status(200).render('success',{
                            action:"Update with photo"
                        });
                    })
                });
            } else {
                console.log('criteria: '+JSON.stringify(criteria));
                db.collection('inventories').updateOne(criteria, {$set: updateDoc},(err,results) => {
                    assert.equal(err,null);
                    client.close()
                    res.status(200).render('success',{
                        action:"Update"
                    });
                })
            }
        });
        });
    } else {
        res.status(500).json({"error": "missing id"});
    }
   }else{
    res.status(500).render('error',{
        action:"Delete",
        message: "Only the manager ("+req.params.manager+") can delete this inventory"
        });  
    }
   });
//DELETE
app.post( '/api/inventory/delete/id/:id/manager/:manager', (req,res) => {
    //console.log(req.params.manager);
    if(req.params.manager == req.session.username){
        if (req.params.id) {
            let criteria = {};
            criteria['_id'] = ObjectID(req.params.id);
            const client = new MongoClient(mongourl);
            client.connect((err) => {
                assert.equal(null, err);
                console.log("Connected successfully to server");
                const db = client.db(dbName);
                console.log(criteria);
                // deleteDocument(db,req.params.id);
                db.collection('inventories').deleteOne(criteria,(err,results) => {
                    assert.equal(err,null)
                client.close()
                console.log("deleted");
                res.status(200).render('success',{
                    action:"Delete"
                });
            });
            });
        } else {
            res.status(500).render('error',{
                action:"Delete",
                message : "missing id"
            });        
        }
    
   }else{
    res.status(500).render('error',{
        action:"Delete",
        message: "Only the manager ("+req.params.manager+") can delete this inventory"
    });  
}
});

app.get( '/error', (req,res) => {
    res.status(500).render('error',{
        action:"",
        message : "error occurs"
    }); 
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
