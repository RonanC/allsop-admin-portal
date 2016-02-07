var express = require("express");
var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/'));

app.get('/', function (req, res) {
    console.log('welcome to route /');
    res.render('index');
});

var bodyParser = require('body-parser');
var PouchDB = require('pouchdb');
var local = new PouchDB('allsop-app');
var remote = new PouchDB('https://fforecrocheseentelticken:bebcc9f90aab1ed06adbdf8ee0f8d23bce5c8300@ronanconnolly.cloudant.com/allsop-app');
var db = local;

//// POUCHDB
var vm = this;
vm.initDb = initDb;
vm.getDetails = getDetails;
vm.saveUser = saveUser;

vm.initDb();

function initDb() {
    // console.log('initDb');
    
    db.changes({
        since: 'now',
        live: true
    }).on('change', function () {
        vm.getDetails();
        // db.replicate.to(remote);
    });

    local.sync(remote, {
        live: true
    }).on('change', function (change) {
        // yo, something changed!
    }).on('error', function (err) {
        // yo, we got an error! (maybe the user went offline?)
    });
            
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

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))


var userRonan = {};
userRonan.deviceToken = '12345';
userRonan.deviceType = 'ios';
userRonan.timeStamp = new Date().toISOString().slice(0, 16);

app.post('/addUser', function (req, res) {
    // add new user
    console.log("/adduser POST route");
    console.log(req.body);

    vm.saveUser(userRonan);
    
    // sync pouch
    res.status(200).send("/adduser POST route\n");
});

app.get('/addUser', function (req, res) {
    // add new user
    console.log("/adduser GET route");
    
    // sync pouch
    res.status(200).send("/adduser GET route\n");
});

function saveUser(newUser) {
    var userUnique = true;

    vm.users.users.forEach(function (user) {
        // console.log('vm.users.users.deviceToken: ' + vm.users.users.deviceToken + '\nuser.deviceToken: ' + user.deviceToken);
        if (user.deviceToken == newUser.deviceToken) {
            // console.log("user already added...");
            userUnique = false;
        }
    }, this);

    if (userUnique) {
        // console.log('vm.users before: ' + JSON.stringify(vm.users.users));
        vm.users.users.push(newUser);
        db.put(vm.users);
        // console.log('vm.users after: ' + JSON.stringify(vm.users.users));
    }
    else{
        // console.log("user not unique");
    }

}

app.listen(port, function () {
    console.log('Our app is running on port: ' + port);
});