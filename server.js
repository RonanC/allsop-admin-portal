var express = require("express");
var bodyParser = require('body-parser');
var PouchDB = require('pouchdb');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/'));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// POUCHDB
// var local = new PouchDB('allsop-app');
var remote = new PouchDB('https://himsediatharriblyluthfur:7cbd754879d93af5eca46bbdeb3beb0ed7297782@ronanconnolly.cloudant.com/allsop-users');
var db = remote;

// data
var vm = this;
vm.users = [];

vm.initDb = initDb;
vm.getDetails = getDetails;
vm.saveUser = saveUser;

vm.initDb();

function initDb() {
    console.log('initDb');

    db.changes({
        since: 'now',
        live: true
    }).on('change', function () {
        vm.getDetails();
        // db.replicate.to(remote);
    });

    // db.sync(remote, {
    //     live: true
    // }).on('change', function (change) {
    //     // yo, something changed!
    // }).on('error', function (err) {
    //     // yo, we got an error! (maybe the user went offline?)
    // });
            
    // var opts = { live: true };
    // db.replicate.to(remoteCouch, opts, syncError);
    // db.replicate.from(remote, opts);

    vm.getDetails();
}

function getDetails() {
    db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
        // console.log('DB Change');
        // console.log('doc: ' + JSON.stringify(doc));

        vm.users = [];

        doc.rows.forEach(function (element) {
            // console.log("element: " + JSON.stringify(element.id));
            // if (element.id === 'users') {
            vm.users.push(element.doc);
            // console.log("vm.users: " + JSON.stringify(vm.users));
            // }
        }, this);
    }).catch(function (err) {
        console.log('err: ' + err);
    });
}

// // test user
// var userRonan = {};
// userRonan.deviceToken = '12345';
// userRonan.deviceType = 'ios';
// userRonan.timeStamp = new Date().toISOString().slice(0, 16);

function saveUser(newUser) {
    // console.log('saving user...');


    // var userUnique = true;
    // console.log("vm.users.users: " + JSON.stringify(vm.users.users));

    // if (vm.users.users.length > 0) { // or undefined?
    //     vm.users.users.forEach(function (user) {
    //         // console.log('newUser.deviceToken: ' + newUser.deviceToken + '\nuser.deviceToken: ' + user.deviceToken);
    //         if (user.deviceToken == newUser.deviceToken) {
    //             // console.log("user already added...");
    //             userUnique = false;
    //         } else if (newUser.deviceToken == null || newUser.deviceToken == undefined || newUser.deviceToken == '') {
    //             userUnique = false;
    //         }
    //     }, this);
    // }

    // if (userUnique) {
    // console.log('vm.users before: ' + JSON.stringify(vm.users.users));
    // vm.users.users.push(newUser);
    
    console.log("attempting to add user to db");

    db.put(newUser).then(function (resp) {
        console.log('resp: ' + JSON.stringify(resp));
    }).catch(function (err) {
        console.log('err: ' + err);
    });
    // console.log('vm.users (after): ' + JSON.stringify(vm.users.users));
        
    return 201;
    // }
    // else {
    // return 202;
    // console.log("user not unique");
    // }
}

// ROUTES
// app.post('/addUser', function (req, res) {
//     // add new user
//     console.log("\n/adduser POST route");
//     // console.log(req);
//     // console.log("req.body: " + JSON.stringify(req.body));
//     // console.log("req.params: " + JSON.stringify(req.params));
//     console.log("req.query: " + JSON.stringify(req.query));
//     // console.log("req.body.user: " + JSON.stringify(req.body.user));

//     var newUser = {};
//     newUser.user_id = req.query.user_id;
//     newUser.deviceToken = req.query.deviceToken;
//     newUser.deviceType = req.query.deviceType;
//     newUser.timeStamp = req.query.timeStamp;//new Date().toISOString().slice(0, 16);
//     //req.body.timeStamp;

//     var statusCode = vm.saveUser(newUser);
//     var message = "unknown";
//     if (statusCode == 201) {
//         message = "user added\n";
//     } else if (statusCode == 202) {
//         message = "user already in database\n";
//     }
    
//     // sync pouch
//     res.status(statusCode).send(message);
// });

app.post('/addUser', function (req, res) {
    // add new user
    console.log("\n/adduser GET route");
    
    // console.log("req.query: " + JSON.stringify(req.query));
    
    var newUser = {};
    newUser._id = req.query._id;
    newUser.user_id = req.query.user_id;
    newUser.deviceToken = req.query.deviceToken;
    newUser.deviceType = req.query.deviceType;
    newUser.timeStamp = req.query.timeStamp;//new Date().toISOString().slice(0, 16);
    //req.body.timeStamp;

    console.log("new user: " + JSON.stringify(newUser));

    var statusCode = vm.saveUser(newUser);
    var message = "attempting to add user to db";
    console.log("attempting to add user to db");
    // if (statusCode == 201) {
    // message = "user added\n";
    // console.log("user added\n");
    // } else if (statusCode == 202) {
    // message = "user already in database\n";
    // console.log("user already in data/base\n");
    // }
    
    
    
    // sync pouch
    res.status(statusCode).send(message);
});

app.get('/', function (req, res) {
    console.log('welcome to route / \n');
    res.status(200).send('welcome to route / \n');
});

// app.get('/initdb', function (req, res) {
//     console.log('init db \n');
//     vm.initDb();
//     res.status(200).send('init db \n');
// });

app.listen(port, function () {
    console.log('Our app is running on port: ' + port);
});