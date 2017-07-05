/* Copyright 2017 S & G Consulting - http://computingdreams.com/ */
/* Version : 0.0.1 */

var expect = require( 'chai' ).expect,
    lambda = require( '../src/index.js' )

const context = require( 'aws-lambda-mock-context' );
const ctx = context();

describe( 'O6 - 00 - When geting time until ISS is at a place', function() {  
    var speechResponse = null
    var speechError = null

    // Fires once for the group of tests, done is mocha's callback to 
    // let it know that an   async operation has completed before running the rest 
    // of the tests, 2000ms is the default timeout though
    before( function( done ) {
        //This fires the event as if a Lambda call was being sent in
        lambda.handler( {
           "session": {
              "new": true,
              "sessionId": "session1234",
              "attributes": {
                 "sessionCount": 30,
                 "firstSession": "Wed, 17 May 2017 11:44:57 GMT",
                 "lastSession": "Mon, 12 Jun 2017 01:43:28 GMT",
                 "name": " ",
                 "nextState" : " ",
              },
              "user": {
                 "userId": "testUser"
              },
              "application": {
                 "applicationId": "amzn1.ask.skill.94faefe4-49dd-4ec2-8bf9-2a18fa4b8024"
              }
           },
           "version": "1.0",
           "request": {
              "locale": "en-US",
              "type": "IntentRequest",
              "requestId": "request5678",
              "intent": {
                 "name": "SpaceWhenIntent",
                 "confirmationStatus": "NONE",
                 "slots": {
                    "City" : {
                       "name": "City",
                       "value": "San Francisco",
                       "confirmationStatus": "NONE"                     
                    }
                 }
              }
           }
       },ctx )

       //Captures the response and/or errors
       ctx.Promise
           .then( resp => { speechResponse = resp; done(); } )
           .catch( err => { speechError = err; done();} )
    } )


    describe( 'The response is structurally correct for Alexa Speech Services', function() {
        it( 'should not have errored',function() { expect ( speechError ).to.be.null } )

        it( 'should have a version', function() { expect( speechResponse.version ).not.to.be.null } )

        it( 'should have a speechlet response', function() { expect( speechResponse.response ).not.to.be.null } )

        it( 'should have session attributes', function() { expect( speechResponse.sessionAttributes ).not.to.be.null } )

        it( 'should not leave the Alexa session open', function() {
            expect( speechResponse.response.shouldEndSession ).not.to.be.null
            expect( speechResponse.response.shouldEndSession ).to.be.true
        } )
    } )

    describe( 'Attributes are completely defined', function() {
        it( 'sessionCount is 31', function() {
            expect( speechResponse.sessionAttributes.sessionCount ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.sessionCount ).to.equal( 31 )
        } )

        it( 'lastSession has value', function() {
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.null
        } )

        it( 'firstSession has value', function() {
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.null
        } )

        it( 'name is blank', function() {
            expect( speechResponse.sessionAttributes.name ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.name ).to.equal( ' ' )
        } )

        it( 'nextState exists', function() {
            expect( speechResponse.sessionAttributes.nextState ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.nextState ).to.equal( ' ' )
        } )
    } )

    describe( 'Directives response is not defined', function() {
        it( 'directives does not exists', function() {
            expect( speechResponse.response.directives ).to.be.undefined
        } )
    } )

    describe( 'Speech response is as expected', function() {
        it( 'output speech exists', function() {
            expect( speechResponse.response.outputSpeech ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech ).not.to.be.null
        } )

        it( 'output speech is ssml', function() {
            expect( speechResponse.response.outputSpeech.type ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.type ).to.equal( 'SSML' )
        } )

        it( 'output ssml contains new game empty player message', function() {
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.null
            expect( speechResponse.response.outputSpeech.ssml.includes( "The I S S will fly over San Francisco in" ) ).to.be.true
        } )
    } )
} )
