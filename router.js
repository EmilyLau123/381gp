

const express = require('express');
var router = express.Router();



router.get( '/login', (req,res) => {
    console.log('login',req.url);
    res.render('login')
    });

router.get( '/checkLogin', (req,res) => {
    //res.send(JSON.stringify(req));

    //console.log('login',req);
    var username = 'John';
    res.status(200).send('Got a POST request'+req.params.username);
    //res.redirect('/home')
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
