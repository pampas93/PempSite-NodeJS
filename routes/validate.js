var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('validate', {status: '', json : '' });
});

router.post('/', function(req, res, next){
  var jsonString = req.body.jsontextarea;

  var validity = false;
  if(isJson(jsonString)){
    validity = true;
    
    try{
    jsonString = JSON.stringify(eval("(" + jsonString + ")"), null, "\t");  //To display json in proper indenting
    }catch(e){ }
  }else{
    validity = false;
  }
  
  res.render('validate', { status: validity, json: jsonString });
});

function isJson(data) {
	try {
		JSON.parse(data);
	} catch (e) {
		//alert("Not a Valid JSON String");
		return false;
	}
    //alert("Valid Json")
    return true;
}


module.exports = router;