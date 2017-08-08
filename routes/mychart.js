var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('mychart', {});
});

router.post('/', function(req, res, next){
    console.log("Post function from Graph page");
    res.render('mychart', {});
});

module.exports = router;