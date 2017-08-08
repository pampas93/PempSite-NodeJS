var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    res.render('mychart', {jsonData: "", axis: ""});
});

router.post('/', function(req, res, next){

    var selectedGraph = req.body.graphType;
    var dataString = req.body.jsontext;

    var returnData;

    if(isJson(dataString)){
        var data = JSON.parse(dataString);

        returnData = FindChartDetails(selectedGraph, data);

        if(returnData["jsFile"] != null){
            res.render('mychart', {ChartTitle: selectedGraph,
                jsonData: dataString, 
                axis: JSON.stringify(returnData["axis"]), 
                jsFile: returnData["jsFile"]});
        }else{
           res.render('mychart', {ChartTitle: "Sorry, Still working on this chart.",
                jsonData: "", 
                axis: "", 
                jsFile: ""});
        }

        
    }else{
        res.render('mychart', {ChartTitle: "Sorry, Json data wasn't valid.",
                jsonData: "", 
                axis: "", 
                jsFile: ""});
    }

});

function FindChartDetails(selectedGraph, jsonData){

    //Need to fill this dictionary every chart is added;    Later, Need to put this dictionary to the database;
    //And create new case in switch.
    var MainChartDictionary = {"Bar Graph (type 1)":"/javascripts/BarType1.js",     
    };

    var returnData = {};

    switch(selectedGraph){
        case "Bar Graph (type 1)":

            var dict = {'x' : "", 'y': ""};
            for(var obj in jsonData){
                var arrayTemp = Object.keys(jsonData[obj]);
                dict['x'] = arrayTemp[0];
                dict['y'] = arrayTemp[1];
            break;
            }
            
            returnData["axis"] = dict;
            returnData["jsFile"] = MainChartDictionary[selectedGraph];

            break;
        default:
            //Graph is not added yet

            returnData["axis"] = null;
            returnData["jsFile"] = null;

            
            break;
    }

    return returnData;

}


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