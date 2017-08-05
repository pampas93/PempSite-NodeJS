var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('validate', {status: '', json : '' });
});

router.post('/', function(req, res, next){
  var jsonString = req.body.jsontextarea;

  var validity = isJson(jsonString);
  try{
    jsonString = JSON.stringify(eval("(" + jsonString + ")"), null, "\t");
  }catch(e){
      
  }
  
  res.render('validate', { status: validity, json: jsonString });
});

function isJson(data) {
	try {
		JSON.parse(data);
	} catch (e) {
		//alert("Not a Valid JSON String");
		return "Sorry, not Valid!";
	}
    //alert("Valid Json")
    return "Valid!";
}


module.exports = router;