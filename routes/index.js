var express = require('express');
var router = express.Router();
//var mysql = require('mysql');

// var sqlConnection = mysql.createPool({
//   connectionLimit: 50,
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'plotify'
// });

/* GET home page. */
router.get('/', function(req, res, next) {

  // sqlConnection.getConnection(function(error, tempCont) {
  //   if(!!error){
  //     tempCont.release();
  //     console.log('Error connecting to DB');
  //   }else{
  //     console.log('Connected to DB from homepage');

  //     tempCont.query("SELECT * FROM graphtemplates", function(error, rows, fields) {
  //       tempCont.release();   //once queried, we no longer need the connection

  //       if(!!error){
  //         console.log('Error in the query');
  //       }else{
  //         console.log(rows);
  //       }
  //     });
  //   }
  // });

  res.render('index', { title: 'Plotifier', myname: 'Pempmau5' });
});


// router.post('/', function(req, res, next){
//   var x = req.body.txtInput;
//   console.log(x);
//   res.render('index', { title: 'Welcome to Plotifier', myname: x });
// });

module.exports = router;
