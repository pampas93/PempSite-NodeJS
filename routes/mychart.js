var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('mychart', {});
});

router.post('/', function(req, res, next){

    var selectedGraph = req.body.graphType;
    var dataString = req.body.jsontext;

    var dict = {'x' : "", 'y': ""};

    if(isJson(dataString)){
        var data = JSON.parse(dataString);
        
        for(var obj in data){
            var arrayTemp = Object.keys(data[obj]);
            dict['x'] = arrayTemp[0];
            dict['y'] = arrayTemp[1];
            break;
        }
        
    }else{
        
    }
    console.log(dict);
    
    res.render('mychart', {jsonData: dataString, axis: JSON.stringify(dict)});
});


//Checks if string in json format
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