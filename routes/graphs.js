var express = require('express');
var router = express.Router();
var mysql = require('mysql2');


router.get('/', function(req, res, next) {
  res.render('graphs', {status: '', json : '', graphs: '', compatibility: false });
});


router.post('/', async function(req, res) {         //Using async function because I use await in query call

  var jsonString = req.body.datatextarea;
  var querying = false;

  var availability = false;
  var stat = "";
  var graphNames = '';

  if(!isJson(jsonString)){

    stat = "Sorry, Data should be a valid json";
    availability = false;

  }else{
    
    var jsonObject = JSON.parse(jsonString);
    jsonString = JSON.stringify(eval("(" + jsonString + ")"), null, "\t");  //To display json in proper indenting
    var depth = Depth(jsonObject);

    if(depth != 1){

      stat = "Sorry, we support only depth = 1";
      availability = false;

    }else{
      var propCount = propertyCount(jsonObject);

      if(propCount == -1){

        stat = "No Compatible graphs; we'll expand our horizon soon (PropertyCount)";
        availability = false;

      }else{
        var dataTypeDict = TypeCount(jsonObject)

        if(dataTypeDict == -1){

          stat = "No Compatible graphs; we'll expand our horizon soon (TypeCount)";
          availability = false;

        }else{

          try{
            let [ queryRows, queryFields ] = await req.db.query('SELECT * FROM graphtemplates WHERE Depth = ? AND PropertyCount = ?',[depth, propCount]);

            var compatibleGraphs = [];
            for(var i=0; i<queryRows.length; i++){

              var rowType = queryRows[i].TypeCount;

              if(graph_compatible(JSON.parse(rowType), dataTypeDict)){
                //console.log(rows[i].Graph_Name);
                compatibleGraphs.push(queryRows[i].Graph_Name);
              }            
            }

            //console.log(compatibleGraphs);
            if(compatibleGraphs.length == 0){

              stat = "No Compatible graphs; we'll expand our horizon soon";
              availability = false;
            }else{

              stat = "Found Compatible Graphs";
              availability = true;

            for(var g in compatibleGraphs){
              graphNames += compatibleGraphs[g] + "$";    //Storing all graphs in one string seperated by $, so later I can split and get back array.
            }

            graphNames = graphNames.slice(0,-1);          //Removing the last character ($)
            }
          }
          catch(e){

            stat = "Couldn't connect or query from DB. Try again later";
            availability = false;

          } //end of catch
        } //end of else (query)
      }
    }
  }

  //execution will come here no matter what.
  res.render('graphs', { status: stat, 
        json: jsonString, 
        graphs: graphNames,
        compatibility: availability });
});

module.exports = router;


//Takes the dataTypes of user data and fetched data from db and checks for compatibility
function graph_compatible(rowType, userType){

    if(Object.keys(rowType).length != Object.keys(userType).length)
      return false;
    
    try{
      for(var type in rowType){

        if(rowType[type] != userType[type])
          return false;
      
      }
    }catch(e){
      return false;
    }
    return true;
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

//Returns the depth of json object
function Depth(obj) {
    var depth = 0;
    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = Depth(d)
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        })
    }
    return 1 + depth
}

// //Supports only Data with depth = 1
function propertyCount(data){
    var count = 0;
    var flag = true;
    countConsistency = true; 
    
    data.forEach(function(obj){
      var itemCount = Object.keys(obj).length;
      if(flag){
        count = itemCount;
        flag = false;
      }else{
        if(itemCount != count)
          countConsistency = false;
      }
    //console.log(data);
    });
    
    if(countConsistency)
      return count;
     else
      return -1;
}

// Returns dictionary if consistent (for now)
function TypeCount(data){
  
    var flag = true;                      // only to check if first obj or not
    var dataTypeDictionary = {
      "string" : 0,
      "number" : 0
    }
    var isConsistent = true;
    
    data.forEach(function(obj){
    
    var stringCount = 0;
    var numberCount = 0;
    
    for(i in obj){
        //console.log(i + ": " + obj[i]);
        var tempType = typeof(obj[i]);
        if(tempType == "string"){
          stringCount += 1;
        }else if(tempType == "number" ){
          numberCount += 1;
        }   
    }
    if(flag){
      dataTypeDictionary["string"] = stringCount;
      dataTypeDictionary["number"] = numberCount;
      flag = false;
    }else{
      if((dataTypeDictionary["string"] != stringCount) || (dataTypeDictionary["number"] != numberCount)){
        isConsistent = false;
      }
    }
  });
  
  if(isConsistent)
    return dataTypeDictionary;          //Main! returns the # of strings and numbers in an object in a dictionary format
   else
    return -1;                          //if not consistent, return -1
}