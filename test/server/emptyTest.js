var expect = require('expect.js');
var file = require('../../controllers/routes');
var sinon = require('sinon');
var mockSuperagent = require('../mockSuperagent');

describe("sample server side test", function(){
  it("should compare bad text", function(){
    var text = "bad text";
    expect(text).to.be.equal("bad text");
  });
});
