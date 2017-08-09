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
                jsFile: returnData["jsFile"],
                cssFile: returnData["cssFile"]});
        }else{
           res.render('mychart', {ChartTitle: "Sorry, Still working on this chart.",
                jsonData: "", 
                axis: "", 
                jsFile: "",
                cssFile: ""});
        }

        
    }else{
        res.render('mychart', {ChartTitle: "Sorry, Json data wasn't valid.",
                jsonData: "", 
                axis: "", 
                jsFile: "",
                cssFile: ""});
    }

});

function FindChartDetails(selectedGraph, jsonData){

    //Need to fill this dictionary every chart is added;    Later, Need to put this dictionary to the database;
    //And create new case in switch.
    var MainChartDictionary = {"Bar Graph (type 1)":"/javascripts/BarType1.js",
        "Stack Bar Graph with 1 (type 1)":"/javascripts/StackBarType.js", 
        "Stack Bar Graph with 2 (type 1)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 3 (type 1)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 4 (type 1)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 5 (type 1)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 6 (type 1)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 1 (type 2)":"/javascripts/StackBarType.js", 
        "Stack Bar Graph with 2 (type 2)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 3 (type 2)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 4 (type 2)":"/javascripts/StackBarType.js",
        "Stack Bar Graph with 5 (type 2)":"/javascripts/StackBarType.js"          
    };

    var returnData = {};

    var temp = selectedGraph.substring(0,15);   //Only for Stack Bar Graph sake;

    if(selectedGraph == "Bar Graph (type 1)"){

        var dict = {'x' : "", 'y': ""};
        for(var obj in jsonData){
            var arrayTemp = Object.keys(jsonData[obj]);
            dict['x'] = arrayTemp[0];
            dict['y'] = arrayTemp[1];
            break;
        }
            
        returnData["axis"] = dict;
        returnData["jsFile"] = MainChartDictionary[selectedGraph];

        var temp = MainChartDictionary[selectedGraph];
        var cssFile = "/stylesheets/" + temp.substring(13, temp.length-3) + ".css";

        returnData["cssFile"] = cssFile;

    }else if(temp == "Stack Bar Graph" ){

        var dict = [];
        for(var obj in jsonData){
            dict = Object.keys(jsonData[obj]);
            break;
        }
        dict.shift();   //Removes the first element

        returnData["axis"] = dict;
        returnData["jsFile"] = MainChartDictionary[selectedGraph];

        var temp = MainChartDictionary[selectedGraph];
        var cssFile = "/stylesheets/" + temp.substring(13, temp.length-3) + ".css";

        returnData["cssFile"] = cssFile;

    }else{
        //Graph is not added yet
        returnData["axis"] = null;
        returnData["jsFile"] = null;
        returnData["cssFile"] = null;
    }

    // switch(selectedGraph){
    //     case "Bar Graph (type 1)":

    //         var dict = {'x' : "", 'y': ""};
    //         for(var obj in jsonData){
    //             var arrayTemp = Object.keys(jsonData[obj]);
    //             dict['x'] = arrayTemp[0];
    //             dict['y'] = arrayTemp[1];
    //         break;
    //         }
            
    //         returnData["axis"] = dict;
    //         returnData["jsFile"] = MainChartDictionary[selectedGraph];

    //         break;
    //     default:
    //         //Graph is not added yet

    //         returnData["axis"] = null;
    //         returnData["jsFile"] = null;

            
    //         break;
    // }

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