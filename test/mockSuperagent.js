var _ = require('underscore');
var fs = require('fs');
module.exports = mock_superagent;

function mockSuperagentResponse(){
  this.urlPattern;
  this.mockResponse;
}

function mock_superagent(){
  this.mock_response = null;
  this.responses = [];
  this.currentUrl = '';
  this.currentQuery = {};
  this.isSimple = false;
  this.addResponse = function(options){
    var defaults = {
      urlMatch: null, //regex to match URL
      paramMatch: null, //object of regexes for different query params 
      file: null, //path to filename
      text: null, //text response, mapped to 'text' and 'body'
      statusCode: 200 //statuscode for response
    }
    this.responses.push(_.extend({},defaults,options));
  }
}

mock_superagent.prototype.respond_with_file = function(filename){
  this.isSimple = true;
  var fs = require('fs');
  this.mock_response = {
    statusCode:200,
    text: fs.readFileSync(filename,'utf8')
  };
  return this;
}

mock_superagent.prototype.respond_with = function(statusCode,text){
  this.isSimple = true;
  this.mock_response = {
    'statusCode': statusCode,
    'text': text
  }
  return this;
}

mock_superagent.prototype.end = function(callback){
  if(this.isSimple){
   // console.log("mocksuperagent end", this.mock_response);
    callback(null,this.mock_response);
  }else{

    loopResponses:
    for(var i = 0, iLen = this.responses.length; i < iLen; i++){
      var responseIterator = this.responses[i];
      
      //if url pattern matches
//      console.log("this.checking for urlMatch: ", this.currentUrl, responseIterator.urlMatch);
      if(this.currentUrl.match(responseIterator.urlMatch) != null){

        //if query params don't match, continue loop1 because this isn't the right response
        if(responseIterator.paramMatch != null && responseIterator.paramMatch != {}){

          loopParams:
          for(var p in responseIterator.paramMatch){
//            console.log("this.checking for paramMatch: ", this.currentQuery[p], responseIterator.paramMatch[p]);
            if(!_.isEqual(this.currentQuery[p], responseIterator.paramMatch[p])) {
              continue loopResponses;
            }
          }
        }

        //should have broken back to main loop by now if there was a problem with params
        var responseText = responseIterator.text || fs.readFileSync(__dirname + '/'+responseIterator.file,'utf8');
        var responseBody;

        try{
          responseBody = JSON.parse(responseText);
        }catch(ex){
          responseBody = null;
        }

//        console.log('returning mock response:', responseIterator.statusCode);
        var response = {
          text: responseText,
          statusCode: responseIterator.statusCode
        }

        callback(null,response);
        return;
      }
    }
    throw new Error("Mock Superagent didn't match the pattern being requested:" + this.currentUrl + JSON.stringify(this.currentQuery));
  }
}

/* these methods just pass the chain along */
mock_superagent.prototype.query = function(queryParams){
  this.currentQuery = queryParams;
  return this;
}

mock_superagent.prototype.send = function(queryParams){
  this.currentQuery = queryParams;
  return this;
}

mock_superagent.prototype.get = function(url){
  this.currentUrl = url;
  return this;
}

mock_superagent.prototype.set = function(url){
  return this;
}

mock_superagent.prototype.post = function(url){
  this.currentUrl = url;
  return this;
}