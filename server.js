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
var remote = new PouchDB('https://fforecrocheseentelticken:bebcc9f90aab1ed06adbdf8ee0f8d23bce5c8300@ronanconnolly.cloudant.com/allsop-app');
var db = remote;

// data
var vm = this;
vm.users = { 'users': [] };
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

        doc.rows.forEach(function (element) {
            // console.log("element: " + JSON.stringify(element.id));
            if (element.id === 'users') {
                vm.users = element.doc;
                // console.log("vm.users: " + JSON.stringify(vm.users));
            }
        }, this);
    });
}

// // test user
// var userRonan = {};
// userRonan.deviceToken = '12345';
// userRonan.deviceType = 'ios';
// userRonan.timeStamp = new Date().toISOString().slice(0, 16);

function saveUser(newUser) {
    // console.log('saving user...');


    var userUnique = true;
    // console.log("vm.users.users: " + JSON.stringify(vm.users.users));

    if (vm.users != undefined && vm.users.users.length > 0) {
        vm.users.users.forEach(function (user) {
            // console.log('newUser.deviceToken: ' + newUser.deviceToken + '\nuser.deviceToken: ' + user.deviceToken);
            if (user.deviceToken == newUser.deviceToken) {
                // console.log("user already added...");
                userUnique = false;
            }
        }, this);
    }

    if (userUnique) {
        // console.log('vm.users before: ' + JSON.stringify(vm.users.users));
        vm.users.users.push(newUser);
        db.put(vm.users);
        // console.log('vm.users (after): ' + JSON.stringify(vm.users.users));
        
        return 201;
        console.log("user added");
    }
    else {
        return 202;
        console.log("user not unique");
    }
}

// ROUTES
app.post('/addUser', function (req, res) {
    // add new user
    console.log("\n/adduser POST route");
    console.log("req.body: " + JSON.stringify(req.body));

    var newUser = {};
    newUser.deviceToken = req.body.deviceToken;
    newUser.deviceType = req.body.deviceType;
    newUser.timeStamp = new Date().toISOString().slice(0, 16);
    //req.body.timeStamp;

    var statusCode = vm.saveUser(newUser);
    var message = "unknown";
    if(statusCode == 201){
        message = "user added\n";
    }else if (statusCode == 202){
        message = "user already in database\n";
    }
    
    // sync pouch
    res.status(statusCode).send(message);
});

app.get('/addUser', function (req, res) {
    // add new user
    console.log("/adduser GET route");
    
    // sync pouch
    res.status(200).send("/adduser GET route\n");
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