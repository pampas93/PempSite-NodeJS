var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var sqlConnection = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'plotify'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('graphs', {status: '', json : '', graphs: '' });
});

router.post('/', function(req, res, next){

  var jsonString = req.body.datatextarea;
  var validity = "";

  var querying = false;

  var compatibleGraphs = [];

  if(isJson(jsonString)){

      var jsonObject = JSON.parse(jsonString);
      //console.log(typeof json);

      var depth = Depth(jsonObject);
      //console.log(depth);

      if(depth == 1){
          var propCount = propertyCount(jsonObject);

          if(propCount != -1){
              //console.log(propCount);
              var dataTypeDict = TypeCount(jsonObject)

              if(dataTypeDict != -1){
                //Query here to db and check.
                querying = true;

                sqlConnection.getConnection(function(error, tempCont){
                    if(error){
                        tempCont.release();
                        console.log("Error connecting to DB");
                        validity = "Error connecting to Database; Try again later";
                    }else{
                        console.log("Success, connected to DB");
                        
                        //var query = "SELECT * FROM graphtemplates WHERE Depth = " + toString(depth)+ " AND PropertyCount = " + toString(propCount);

                        tempCont.query('SELECT * FROM graphtemplates WHERE Depth = ? AND PropertyCount = ?',[depth, propCount], function(error, rows, fields){
                            tempCont.release();

                            var graphNames = '';

                            if(error){
                                console.log("Error while Querying form database");
                                validity = "Error while Querying form database";
                            }else{
                                //validity = "Query done from DB";
                                for (var i = 0; i < rows.length; i++){
                                    
                                    var rowType = rows[i].TypeCount;
                                    
                                    if(graph_compatible(JSON.parse(rowType), dataTypeDict)){
                                        //console.log(rows[i].Graph_Name);
                                        compatibleGraphs.push(rows[i].Graph_Name);
                                    }
                                }

                                if(compatibleGraphs.length == 0)
                                    validity = "No Compatible graphs; we'll expand our horizon soon";
                                else{
                                    validity = "Found Compatible graphs.";
                                    for(var g in compatibleGraphs)
                                        graphNames +=  compatibleGraphs[g] + "$";

                                    graphNames = graphNames.slice(0,-1);    //Removing the last character ($)

                                }

                                //console.log(validity);
                            }

                            res.render('graphs', { status: validity, json: jsonString, graphs: graphNames });

                        });
                        
                    }
                });

              }else{
                  validity = "Property datatype count not consistent";
              }

          }else{
              validity = "Property count not Consistent";
          }
      }else{
          validity = "Sorry, we support only depth = 1";
      }

    // Only used to indent it properly.
    try{
    jsonString = JSON.stringify(eval("(" + jsonString + ")"), null, "\t");  //To display json in proper indenting
    }catch(e){ }

  }else{
      validity = "Sorry, Data should be a valid json";
  }

  if(!querying){
    console.log("Oder!!!!!!!!!!!!!!!!!!!!!!!!!!");
    res.render('graphs', { status: validity, json: jsonString, graphs: '' });
  }
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