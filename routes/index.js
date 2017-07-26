var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plotifier', myname: 'Pempmau5' });
});

router.post('/', function(req, res, next){
  var x = req.body.txtInput;
  console.log(x);
  res.render('index', { title: 'Welcome to Plotifier', myname: x });
});

module.exports = router;
