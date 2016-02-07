var express = require("express");
var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/'));

app.get('/', function (req, res) {
    res.render('index');
});

// app.post('/newUser', function (req, res) {
//     // add new user
// });

app.listen(port, function () {
    console.log('Our app is running on port: ' + port);
});