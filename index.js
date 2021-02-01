const express = require('express');
const multer = require('multer');
var bodyParser = require('body-parser');
var node_xj = require("xls-to-json");
const app = express();

app.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        if (file) {
            cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        }
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');
app.get('/api/home', (req, res) => {
    res.json({
        status: 1,
        message: 'app run successfully'
    })
});
app.post('/api/uploadfile', (req, res) => {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        node_xj({
                input: './uploads/' + req.file.filename, // input xls
                // output: './uploads/' + "output.json", // output json
                // sheet: "sheetname", // specific sheetname
                // rowsToSkip: 5, // number of rows to skip at the top of the sheet; defaults to 0
                // allowEmptyKey: false, // avoids empty keys in the output, example: {"": "something"}; default: true
            },
            function(err, result) {
                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                } else {
                    res.json({ error_code: 0, err_desc: null, result: result });
                }
            }
        );



    });
});
let server = app.listen(8080, function() {

    let host = server.address().address;
    let port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})